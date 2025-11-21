import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from articles.models import Article

User = get_user_model()


@pytest.mark.django_db
class TestArticleListView:
    """Tests de la vue liste des articles"""
    
    def test_list_articles_success(self, api_client, multiple_articles):
        """Test : Récupérer la liste des articles (200)"""
        url = reverse('list_articles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['count'] == 5
        assert len(response.data['data']['articles']) == 5
    
    def test_list_articles_empty(self, api_client):
        """Test : Liste vide si aucun article"""
        url = reverse('list_articles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['articles'] == []


@pytest.mark.django_db
class TestArticleCreateView:
    """Tests de la vue création d'article"""
    
    def test_create_article_success(self, authenticated_client):
        """Test : Créer un article (201)"""
        url = reverse('create_article')
        data = {
            'title': 'Nouvel article de test',
            'content': 'Ceci est le contenu de mon nouvel article de test qui est assez long.'
        }
        response = authenticated_client.post(url, data, format='json')
        
        # ✅ Debug : afficher l'erreur si échec
        if response.status_code != status.HTTP_201_CREATED:
            print(f"\n❌ Status Code: {response.status_code}")
            print(f"❌ Response Data: {response.data}")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status_code'] == 201
        assert response.data['message'] == 'Article créé avec succès'
        assert response.data['data']['article']['title'] == 'Nouvel article de test'
        
        # Vérifie que l'article est bien en DB
        assert Article.objects.filter(title='Nouvel article de test').exists()
    
    def test_create_article_unauthenticated(self, api_client):
        """Test : Créer un article sans authentification (401)"""
        url = reverse('create_article')
        data = {
            'title': 'Test Article',
            'content': 'Content très long pour la validation de test'
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_article_invalid_data(self, authenticated_client):
        """Test : Créer un article avec des données invalides (400)"""
        url = reverse('create_article')
        data = {
            'title': 'abc',  # ❌ Trop court (< 5 caractères)
            'content': 'short'  # ❌ Trop court (< 20 caractères)
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
    
    def test_create_article_missing_fields(self, authenticated_client):
        """Test : Créer un article sans tous les champs requis (400)"""
        url = reverse('create_article')
        data = {'title': 'Titre valide seulement avec plus de caracteres'}  # ❌ Manque 'content'
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestArticleUpdateView:
    """Tests de la vue mise à jour d'article"""
    
    def test_update_article_success(self, authenticated_client, article):
        """Test : Modifier son propre article (200)"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'Article modifié avec succès',
            'content': 'Contenu modifié de l\'article avec plus de texte pour validation.'
        }
        response = authenticated_client.put(url, data, format='json')
        
        # ✅ Debug : afficher l'erreur si échec
        if response.status_code != status.HTTP_200_OK:
            print(f"\n❌ Status Code: {response.status_code}")
            print(f"❌ Response Data: {response.data}")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['article']['title'] == 'Article modifié avec succès'
        
        # Vérifie en DB
        article.refresh_from_db()
        assert article.title == 'Article modifié avec succès'
    
    def test_update_article_not_author(self, other_authenticated_client, article):
        """Test : Modifier l'article d'un autre utilisateur (403)"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'Tentative de modification',
            'content': 'Contenu modifié par un autre utilisateur test.'
        }
        response = other_authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_update_article_not_found(self, authenticated_client):
        """Test : Modifier un article inexistant (404)"""
        url = reverse('update_article', kwargs={'pk': 99999})
        data = {
            'title': 'Article inexistant',
            'content': 'Contenu de l\'article inexistant pour le test.'
        }
        response = authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestArticleDeleteView:
    """Tests de la vue suppression d'article"""
    
    def test_delete_article_success(self, authenticated_client, article):
        """Test : Supprimer son propre article (200)"""
        article_id = article.pk
        url = reverse('delete_article', kwargs={'pk': article_id})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert not Article.objects.filter(pk=article_id).exists()
    
    def test_delete_article_not_author(self, other_authenticated_client, article):
        """Test : Supprimer l'article d'un autre utilisateur (403)"""
        url = reverse('delete_article', kwargs={'pk': article.pk})
        response = other_authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Article.objects.filter(pk=article.pk).exists()  # Article toujours présent
    
    def test_delete_article_not_found(self, authenticated_client):
        """Test : Supprimer un article inexistant (404)"""
        url = reverse('delete_article', kwargs={'pk': 99999})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND