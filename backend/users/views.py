from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from users.decorators import api_permission_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from .models import User
import json

@csrf_exempt
@api_permission_required('users.view_user', required_role='admin')
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

            if role == 'admin' or is_superuser:
                if not request.user.is_authenticated or request.user.role != 'admin':
                    return JsonResponse({'error': 'Seul un administrateur peut créer un utilisateur avec le rôle admin.'}, status=403)

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

@csrf_exempt
@api_permission_required('users.view_user')
def liste_users(request):
    if request.method == 'GET':
        fileds = ('id', 'username', 'email', 'first_name', 'last_name', 'sujet', 'pp', 'role', 'is_staff', 'is_active', 'is_superuser', 'date_joined', 'last_login')
        if request.user.role == 'admin' or request.user.is_superuser:
            users = list(User.objects.values(*fileds))
        else:
            users = list(User.objects.filter(id=request.user.id).values(*fileds))
        return JsonResponse({'users': users}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
@api_permission_required('users.change_user', required_role='admin')
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
@api_permission_required('users.delete_user', required_role='admin')
def supprimer_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'Utilisateur supprimé avec succès'}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def inscription_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password_raw = data.get('password')

            # Validation basique
            if not username or not email or not password_raw:
                return JsonResponse({'error': 'Champs requis manquants (username, email, password)'}, status=400)

            password = make_password(password_raw)

            user = User.objects.create(
                username=username,
                email=email,
                password=password,
                role='user',  # Rôle par défaut
                is_active=True
            )

            return JsonResponse({
                'message': 'Inscription réussie',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                }
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def connexion_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({
                    'message': 'Connexion réussie',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                    }
                }, status=200)
            else:
                return JsonResponse({'error': 'Identifiants invalides'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def deconnexion_user(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Déconnexion réussie'}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
