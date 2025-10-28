from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
    # Ajout des backends de filtrage
    filter_backends = [
        DjangoFilterBackend,  # Filtres exacts
        filters.SearchFilter,  # Recherche dans les champs
        filters.OrderingFilter  # Tri des résultats
    ]
    
    # Champs sur lesquels on peut filtrer (exact match)
    filterset_fields = ['author', 'created_at']
    
    # Champs dans lesquels on peut rechercher (recherche partielle)
    search_fields = ['title', 'content']
    
    # Champs sur lesquels on peut trier
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']  # Tri par défaut (plus récent d'abord)