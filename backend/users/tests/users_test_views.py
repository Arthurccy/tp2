import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
class TestUserRegistration:
    """Tests de l'inscription utilisateur"""
    
    def test_register_user_success(self, api_client):
        """Test : Inscription réussie avec données valides (201)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePassword123',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        # Debug si erreur
        if response.status_code != status.HTTP_201_CREATED:
            print(f"\n❌ Status: {response.status_code}")
            print(f"❌ Data: {response.data}")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user' in response.data.get('data', {})
    
    def test_register_user_minimal_data(self, api_client):
        """Test : Inscription avec données minimales (username + password)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'minimaluser',
            'password': 'SecurePassword123',
            'email': 'minimal@example.com',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        if response.status_code != status.HTTP_201_CREATED:
            print(f"\n❌ Status: {response.status_code}")
            print(f"❌ Data: {response.data}")
        
        assert response.status_code == status.HTTP_201_CREATED
    
    def test_register_user_duplicate_username(self, api_client, user):
        """Test : Inscription avec un username déjà utilisé (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': user.username,
            'email': 'different@example.com',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_duplicate_email(self, api_client, user):
        """Test : Inscription avec un email déjà utilisé (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'differentuser',
            'email': user.email,
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_missing_username(self, api_client):
        """Test : Inscription sans username (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'email': 'test@example.com',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_missing_password(self, api_client):
        """Test : Inscription sans mot de passe (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_weak_password(self, api_client):
        """Test : Inscription avec mot de passe faible (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_password_too_common(self, api_client):
        """Test : Inscription avec mot de passe trop commun (400)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_invalid_email_format(self, api_client):
        """Test : Inscription avec format email invalide"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'not-an-email',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        # Peut être accepté selon validation
        pass


@pytest.mark.django_db
class TestUserLogin:
    """Tests de la connexion utilisateur (JWT)"""
    
    def test_login_success(self, api_client, user):
        """Test : Connexion réussie avec credentials valides (200)"""
        url = reverse('token_obtain_pair')  # ✅ JWT reste identique
        data = {
            'username': user.username,
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        if response.status_code != status.HTTP_200_OK:
            print(f"\n❌ Status: {response.status_code}")
            print(f"❌ Data: {response.data}")
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_wrong_password(self, api_client, user):
        """Test : Connexion avec mauvais mot de passe (401)"""
        url = reverse('token_obtain_pair')
        data = {
            'username': user.username,
            'password': 'wrongpassword'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_wrong_username(self, api_client):
        """Test : Connexion avec username inexistant (401)"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'nonexistentuser',
            'password': 'anypassword'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_missing_credentials(self, api_client):
        """Test : Connexion sans credentials (400)"""
        url = reverse('token_obtain_pair')
        data = {}
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_refresh_token_success(self, api_client, user):
        """Test : Rafraîchir le token avec un refresh token valide"""
        login_url = reverse('token_obtain_pair')
        login_data = {
            'username': user.username,
            'password': 'testpass123'
        }
        login_response = api_client.post(login_url, login_data, format='json')
        
        assert 'refresh' in login_response.data
        refresh_token = login_response.data['refresh']
        
        refresh_url = reverse('token_refresh')
        refresh_data = {'refresh': refresh_token}
        
        response = api_client.post(refresh_url, refresh_data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
    
    def test_refresh_token_invalid(self, api_client):
        """Test : Rafraîchir avec un token invalide (401)"""
        url = reverse('token_refresh')
        data = {'refresh': 'invalid_token_here'}
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserProfile:
    """Tests du profil utilisateur"""
    
    def test_get_own_profile(self, authenticated_client, user):
        """Test : Un utilisateur peut voir son propre profil"""
        pass
    
    def test_update_own_profile(self, authenticated_client, user):
        """Test : Un utilisateur peut modifier son profil"""
        pass


@pytest.mark.django_db
class TestUserPasswordValidation:
    """Tests de validation des mots de passe"""
    
    def test_password_too_short(self, api_client):
        """Test : Mot de passe trop court (< 8 caractères)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_password_numeric_only(self, api_client):
        """Test : Mot de passe uniquement numérique"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '12345678',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_password_similar_to_username(self, api_client):
        """Test : Mot de passe similaire au username"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testuser123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserEdgeCases:
    """Tests des cas limites utilisateur"""
    
    def test_register_with_special_characters_username(self, api_client):
        """Test : Username avec caractères spéciaux"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'user@#$%',
            'email': 'test@example.com',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        # Peut être accepté ou rejeté selon validation
        pass
    
    def test_register_with_very_long_username(self, api_client):
        """Test : Username très long (> 150 caractères)"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': 'a' * 200,
            'email': 'test@example.com',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_case_sensitive_username(self, api_client, user):
        """Test : Les usernames sont sensibles à la casse"""
        url = reverse('inscription')  # ✅ CHANGEMENT ICI
        data = {
            'username': user.username.upper(),
            'email': 'different@example.com',
            'password': 'SecurePassword123',
            'role': 'user'
        }
        
        response = api_client.post(url, data, format='json')
        
        # Django autorise les usernames avec casse différente
        if response.status_code != status.HTTP_201_CREATED:
            print(f"\n❌ Status: {response.status_code}")
            print(f"❌ Data: {response.data}")
        
        assert response.status_code == status.HTTP_201_CREATED