import pytest
from articles.serializers import ArticleSerializer
from articles.models import Article


@pytest.mark.django_db
class TestArticleSerializer:
    """Tests du serializer Article"""
    
    def test_serialize_article(self, article):
        """Test : Sérialisation d'un article"""
        serializer = ArticleSerializer(article)
        data = serializer.data
        
        assert data['id'] == article.id
        assert data['title'] == article.title
        assert data['content'] == article.content
        assert data['author'] == article.author.id
        assert 'created_at' in data
        assert 'updated_at' in data
    
    def test_deserialize_valid_article(self, user):
        """Test : Désérialisation valide"""
        data = {
            'title': 'Nouvel article',
            'content': 'Contenu du nouvel article',
            'author': user.id
        }
        
        serializer = ArticleSerializer(data=data)
        assert serializer.is_valid()
        
        article = serializer.save()
        assert article.title == 'Nouvel article'
        assert article.author == user
    
    def test_validate_title_too_short(self):
        """Test : Titre trop court (validation échoue)"""
        data = {
            'title': 'ab',  # Moins de 3 caractères
            'content': 'Contenu valide avec au moins 10 caractères'
        }
        
        serializer = ArticleSerializer(data=data)
        assert not serializer.is_valid()
        assert 'title' in serializer.errors
    
    def test_validate_content_too_short(self):
        """Test : Contenu trop court"""
        data = {
            'title': 'Titre valide',
            'content': 'court'  # Moins de 10 caractères
        }
        
        serializer = ArticleSerializer(data=data)
        assert not serializer.is_valid()
        assert 'content' in serializer.errors
