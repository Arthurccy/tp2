import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    """Client API pour les tests"""
    return APIClient()


@pytest.fixture
def user(db):
    """Utilisateur de test standard"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        role='user'
    )


@pytest.fixture
def admin_user(db):
    """Utilisateur admin pour les tests"""
    return User.objects.create_user(
        username='admin',
        email='admin@example.com',
        password='adminpass123',
        role='admin',
        is_staff=True,
        is_superuser=True
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Client authentifié avec JWT"""
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = user
    return api_client


@pytest.fixture
def admin_authenticated_client(api_client, admin_user):
    """Client authentifié en tant qu'admin avec JWT"""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = admin_user
    return api_client


@pytest.fixture
def article(db, user):
    """Article de test"""
    from articles.models import Article
    return Article.objects.create(
        title='Test Article',
        content='Test content for the article.',
        author=user
    )


@pytest.fixture
def multiple_articles(db, user):
    """✅ Crée plusieurs articles pour les tests de liste"""
    from articles.models import Article
    articles = []
    for i in range(5):
        articles.append(Article.objects.create(
            title=f'Article {i+1}',
            content=f'Contenu de l\'article numéro {i+1}',
            author=user
        ))
    return articles


@pytest.fixture
def other_user(db):
    """Un autre utilisateur pour les tests de permissions"""
    return User.objects.create_user(
        username='otheruser',
        email='other@example.com',
        password='otherpass123',
        role='user'
    )


@pytest.fixture
def multiple_articles(db, user):
    """Crée plusieurs articles pour les tests de liste"""
    from articles.models import Article
    articles = []
    for i in range(5):
        articles.append(Article.objects.create(
            title=f'Article {i+1}',
            content=f'Contenu de l\'article numéro {i+1}',
            author=user
        ))
    return articles

@pytest.fixture
def other_user(db):
    """Un autre utilisateur pour les tests de permissions"""
    return User.objects.create_user(
        username='otheruser',
        email='other@example.com',
        password='otherpass123',
        role='user'
    )


@pytest.fixture
def other_authenticated_client(api_client, other_user):
    """Client authentifié avec un autre utilisateur"""
    refresh = RefreshToken.for_user(other_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = other_user
    return api_client