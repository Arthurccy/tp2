from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


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


@api_view(['POST'])
def create_article(request):
    """
    Crée un nouvel article.
    """
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_articles(request):
    """
    Récupère la liste de tous les articles.
    """
    articles = Article.objects.all()
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_article(request, pk):
    """
    Met à jour un article existant (id = pk).
    """
    article = get_object_or_404(Article, pk=pk)
    serializer = ArticleSerializer(article, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_article(request, pk):
    """
    Supprime un article existant (id = pk).
    """
    article = get_object_or_404(Article, pk=pk)
    article.delete()
    return Response({'message': 'Article supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
