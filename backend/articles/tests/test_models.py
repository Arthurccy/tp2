import pytest
from django.contrib.auth import get_user_model
from articles.models import Article

User = get_user_model()


@pytest.mark.django_db
class TestArticleModel:
    """Tests du modèle Article"""
    
    def test_create_article(self, user):
        """Test : Créer un article"""
        article = Article.objects.create(
            title='Mon article',
            content='Contenu de l\'article',
            author=user
        )
        
        assert article.title == 'Mon article'
        assert article.content == 'Contenu de l\'article'
        assert article.author == user
        assert article.created_at is not None
        assert article.updated_at is not None
    
    def test_article_str_representation(self, article):
        """Test : Représentation string de l'article"""
        # ✅ CORRECTION : Le format est "titre - username"
        expected = f"{article.title} - {article.author.username}"
        assert str(article) == expected
    
    def test_article_ordering(self, multiple_articles):
        """Test : Les articles sont triés par date décroissante"""
        articles = Article.objects.all()
        
        # Vérifie que les articles sont triés du plus récent au plus ancien
        for i in range(len(articles) - 1):
            assert articles[i].created_at >= articles[i + 1].created_at
    
    def test_article_author_relation(self, article, user):
        """Test : Relation avec l'auteur"""
        assert article.author == user
        # ✅ CORRECTION : c'est 'articles' pas 'article_set' (à cause du related_name)
        assert article in user.articles.all()
    
    def test_delete_article(self, article):
        """Test : Supprimer un article"""
        article_id = article.id
        article.delete()
        
        assert not Article.objects.filter(id=article_id).exists()