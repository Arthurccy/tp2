from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

from .serializers import (
    UserSerializer, UserCreateSerializer, RegisterSerializer,
    ChangePasswordSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdminForUser
from .utils import generate_password_reset_link
from .tasks import send_reset_password_email

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les utilisateurs.
    - Liste: Admin voit tous, User voit uniquement son profil
    - Création: Admin uniquement
    - Modification/Suppression: Admin ou propriétaire
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """Permissions dynamiques selon l'action"""
        if self.action == 'create':
            # Seul l'admin peut créer un utilisateur via cette vue
            return [IsAdminUser()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Admin ou propriétaire
            return [IsAuthenticated(), IsOwnerOrAdminForUser()]
        elif self.action == 'list':
            # Authentifié uniquement
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        """Utiliser le bon serializer selon l'action"""
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        """
        Admin ou superuser voit tous les utilisateurs,
        User voit uniquement son profil
        """
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Endpoint pour récupérer son propre profil"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Endpoint pour changer son mot de passe"""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Vérifier l'ancien mot de passe
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Mot de passe incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Définir le nouveau mot de passe
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({'message': 'Mot de passe changé avec succès'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    """Endpoint public pour l'inscription (rôle user uniquement)"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Inscription réussie',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """Endpoint public pour la connexion"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username et password requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Identifiants invalides'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(generics.GenericAPIView):
    """Endpoint pour la déconnexion (blacklist du refresh token)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Demander un reset de mot de passe"""
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Par sécurité, on ne révèle pas si l'email existe
            return Response(
                {'message': 'Si cet email existe, un lien de réinitialisation a été envoyé'},
                status=status.HTTP_200_OK
            )
        
        # Génère le lien de réinitialisation
        reset_link = generate_password_reset_link(user, "http://localhost:3000/reset-password")
        
        subject = "Réinitialisation de votre mot de passe"
        body = f"""
        Bonjour {user.first_name or user.username},

        Vous avez demandé la réinitialisation de votre mot de passe.
        Cliquez sur le lien ci-dessous pour en définir un nouveau :

        {reset_link}

        Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.
        """
        
        # Envoi asynchrone via Celery
        send_reset_password_email.delay(subject, body, user.email)
        
        return Response(
            {'message': 'Si cet email existe, un lien de réinitialisation a été envoyé'},
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    """Confirmer le reset de mot de passe"""
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            if not default_token_generator.check_token(user, token):
                return Response(
                    {'error': 'Token invalide ou expiré'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['password'])
            user.save()
            
            return Response(
                {'message': 'Mot de passe réinitialisé avec succès'},
                status=status.HTTP_200_OK
            )
        
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {'error': 'Lien invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)