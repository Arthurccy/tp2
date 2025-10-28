from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from .models import User
import json

@csrf_exempt
def creer_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            sujet = data.get('sujet')
            pp = data.get('pp')
            role = data.get('role', 'user')
            password_raw = data.get('password')

            if not username or not email or not password_raw:
                return JsonResponse({'error': 'Champs requis manquants'}, status=400)

            password = make_password(password_raw)

            user = User.objects.create(
                username=username,
                email=email,
                sujet=sujet,
                pp=pp,
                role=role,
                password=password
            )

            return JsonResponse({
                'message': 'Utilisateur créé avec succès',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'sujet': user.sujet,
                    'pp': user.pp,
                    'role': user.role
                }
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


def liste_users(request):
    if request.method == 'GET':
        users = list(User.objects.values('id', 'username', 'email', 'sujet', 'pp', 'role'))
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
            user.sujet = data.get('sujet', user.sujet)
            user.pp = data.get('pp', user.pp)
            user.role = data.get('role', user.role)

            if 'password' in data and data['password']:
                user.password = make_password(data['password'])

            user.save()
            return JsonResponse({'message': 'Utilisateur modifié avec succès'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Données JSON invalides'}, status=400)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def supprimer_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'DELETE':
        user.delete()
        return JsonResponse({'message': 'Utilisateur supprimé avec succès'}, status=200)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
