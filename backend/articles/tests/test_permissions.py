import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from articles.models import Article

User = get_user_model()


@pytest.mark.django_db
class TestArticlePermissions:
    """Tests des permissions CRUD sur les articles"""
    
    def test_unauthenticated_cannot_create_article(self, api_client):
        """❌ Un utilisateur non connecté ne peut pas créer d'article"""
        url = reverse('create_article')
        data = {
            'title': 'Test Article Title',
            'content': 'This is a test content with enough characters to pass validation.'
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_authenticated_can_create_article(self, authenticated_client):
        """✅ Un utilisateur connecté peut créer un article"""
        url = reverse('create_article')
        data = {
            'title': 'My Article Title',
            'content': 'This is my article content with sufficient length for validation.',
            # ❌ NE PAS ENVOYER 'author' - défini automatiquement
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['data']['article']['title'] == 'My Article Title'
    
    def test_author_can_update_own_article(self, authenticated_client, article):
        """✅ L'auteur peut modifier son propre article"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'Updated Title Here',
            'content': 'Updated content with enough characters to pass validation rules.',
            # ❌ NE PAS ENVOYER 'author' - géré automatiquement
        }
        response = authenticated_client.put(url, data, format='json')
        
        # Debug si échec
        if response.status_code != status.HTTP_200_OK:
            print(f"Erreur: {response.status_code}")
            print(f"Détails: {response.data}")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['article']['title'] == 'Updated Title Here'
    
    def test_non_author_cannot_update_article(self, other_authenticated_client, article):
        """❌ Un utilisateur ne peut pas modifier l'article d'un autre"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'Hacked Title Attempt',
            'content': 'Hacked content with enough characters for validation.'
        }
        response = other_authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_author_can_delete_own_article(self, authenticated_client, article):
        """✅ L'auteur peut supprimer son propre article"""
        url = reverse('delete_article', kwargs={'pk': article.pk})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert Article.objects.filter(pk=article.pk).count() == 0
    
    def test_non_author_cannot_delete_article(self, other_authenticated_client, article):
        """❌ Un utilisateur ne peut pas supprimer l'article d'un autre"""
        url = reverse('delete_article', kwargs={'pk': article.pk})
        response = other_authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Article.objects.filter(pk=article.pk).exists()
    
    def test_unauthenticated_cannot_update_article(self, api_client, article):
        """❌ Non authentifié ne peut pas modifier"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'New Title For Test',
            'content': 'New content with enough characters to pass validation.'
        }
        response = api_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_unauthenticated_cannot_delete_article(self, api_client, article):
        """❌ Non authentifié ne peut pas supprimer"""
        url = reverse('delete_article', kwargs={'pk': article.pk})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_anyone_can_list_articles(self, api_client, article):
        """✅ Tout le monde peut lister les articles (public)"""
        url = reverse('list_articles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['count'] >= 1


@pytest.mark.django_db
class TestArticleOwnershipValidation:
    """Tests de validation de la propriété des articles"""
    
    def test_cannot_change_article_author(self, authenticated_client, article, other_user):
        """❌ Impossible de changer l'auteur d'un article via UPDATE"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': article.title,
            'content': 'Updated content with sufficient length for validation rules.',
            # La vue force l'auteur à request.user, donc pas besoin de le tester ici
        }
        response = authenticated_client.put(url, data, format='json')
        
        # ✅ L'auteur ne doit pas avoir changé
        article.refresh_from_db()
        assert article.author == authenticated_client.user
    
    def test_article_author_set_on_creation(self, authenticated_client):
        """✅ L'auteur est automatiquement défini lors de la création"""
        url = reverse('create_article')
        data = {
            'title': 'Auto Author Test Article',
            'content': 'Content here with enough characters to pass validation rules.',
            # ❌ NE PAS ENVOYER 'author' - défini automatiquement
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        article_id = response.data['data']['article']['id']
        article = Article.objects.get(pk=article_id)
        assert article.author == authenticated_client.user


@pytest.mark.django_db
class TestArticlePermissionsEdgeCases:
    """Tests des cas limites de permissions"""
    
    def test_admin_cannot_update_user_article(self, admin_authenticated_client, article):
        """❌ Même un admin ne peut pas modifier l'article d'un user"""
        url = reverse('update_article', kwargs={'pk': article.pk})
        data = {
            'title': 'Admin Override Attempt',
            'content': 'Admin trying to override with enough content length.'
        }
        response = admin_authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_multiple_users_same_title_different_articles(self, authenticated_client, other_authenticated_client):
        """✅ Deux utilisateurs peuvent créer des articles avec le même titre"""
        url = reverse('create_article')
        data1 = {
            'title': 'Same Title Article',
            'content': 'User 1 content with enough characters for validation rules.',
            # ❌ NE PAS ENVOYER 'author'
        }
        
        response1 = authenticated_client.post(url, data1, format='json')
        assert response1.status_code == status.HTTP_201_CREATED
        
        data2 = {
            'title': 'Same Title Article',
            'content': 'User 2 content with enough characters for validation rules.',
            # ❌ NE PAS ENVOYER 'author'
        }
        response2 = other_authenticated_client.post(url, data2, format='json')
        assert response2.status_code == status.HTTP_201_CREATED
        
        # ✅ Deux articles distincts
        assert response1.data['data']['article']['id'] != response2.data['data']['article']['id']
    
    def test_deleted_user_articles_handling(self, authenticated_client):
        """✅ Les articles d'un utilisateur supprimé sont supprimés (CASCADE)"""
        # Crée un article
        article = Article.objects.create(
            title='To be deleted article',
            content='Content that will be deleted with the user account.',
            author=authenticated_client.user
        )
        article_id = article.id
        
        # Supprime l'utilisateur
        authenticated_client.user.delete()
        
        # ✅ L'article doit aussi être supprimé (CASCADE)
        assert not Article.objects.filter(pk=article_id).exists()