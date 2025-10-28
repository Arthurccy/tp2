from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .tasks import send_reset_password_email
from .utils import generate_password_reset_link
from django.contrib.auth import get_user_model
import json


User = get_user_model()
token_generator = PasswordResetTokenGenerator()

@csrf_exempt
def creer_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password_raw = data.get('password')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            sujet = data.get('sujet', '')
            pp = data.get('pp', '')
            role = data.get('role', 'user')
            is_staff = data.get('is_staff', False)
            is_active = data.get('is_active', True)
            is_superuser = data.get('is_superuser', False)
            last_login = data.get('last_login', None)

            # Validation basique
            if not username or not email or not password_raw:
                return JsonResponse({'error': 'Champs requis manquants (username, email, password)'}, status=400)

            password = make_password(password_raw)

            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                sujet=sujet,
                pp=pp,
                role=role,
                password=password,
                is_staff=is_staff,
                is_active=is_active,
                is_superuser=is_superuser,
                last_login=last_login
            )

            return JsonResponse({
                'message': 'Utilisateur créé avec succès',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'sujet': user.sujet,
                    'pp': user.pp,
                    'role': user.role,
                    'is_staff': user.is_staff,
                    'is_active': user.is_active,
                    'is_superuser': user.is_superuser,
                    'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                    'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else None
                }
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


def liste_users(request):
    if request.method == 'GET':
        users = list(User.objects.values('id', 'username', 'email', 'first_name', 'last_name', 'sujet', 'pp', 'role', 'is_staff', 'is_active', 'is_superuser', 'date_joined', 'last_login'))
        return JsonResponse({'users': users}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def modifier_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            password_raw = data.get('password', None)
            if password_raw:
                user.password = make_password(password_raw)
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.sujet = data.get('sujet', user.sujet)
            user.pp = data.get('pp', user.pp)
            user.role = data.get('role', user.role)
            user.is_staff = data.get('is_staff', user.is_staff)
            user.is_active = data.get('is_active', user.is_active)
            user.is_superuser = data.get('is_superuser', user.is_superuser)
            user.last_login = data.get('last_login', user.last_login)

            user.save()

            return JsonResponse({'message': 'Utilisateur modifié avec succès'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)


@csrf_exempt
def supprimer_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'Utilisateur supprimé avec succès'}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)



@csrf_exempt
def demander_reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'error': 'Email requis'}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Aucun utilisateur avec cet email'}, status=404)

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

            return JsonResponse({'message': 'E-mail de réinitialisation envoyé'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON invalide'}, status=400)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def reset_password_confirm(request, uidb64, token):
    if request.method == 'POST':
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.tokens import default_token_generator
        from django.contrib.auth.hashers import make_password

        try:
            data = json.loads(request.body)
            new_password = data.get('password')
            if not new_password:
                return JsonResponse({'error': 'Mot de passe requis'}, status=400)

            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return JsonResponse({'error': 'Token invalide ou expiré'}, status=400)

            user.password = make_password(new_password)
            user.save()

            return JsonResponse({'message': 'Mot de passe réinitialisé avec succès'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)




