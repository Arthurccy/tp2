from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer
from users.permissions import IsOwnerOrAdmin, IsAdminOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les articles avec permissions:
    - Lecture: Tous les utilisateurs authentifiés
    - Création: Tous les utilisateurs authentifiés
    - Modification/Suppression: Propriétaire, Admin (role='admin') ou Superuser uniquement
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    # Filtrage et recherche
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    
    filterset_fields = ['author', 'created_at']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Assigner automatiquement l'auteur lors de la création"""
        serializer.save(author=self.request.user)


# Si vous voulez garder des vues fonction (optionnel)
# Mais je recommande d'utiliser uniquement le ViewSet ci-dessus

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_article(request):
    """Crée un nouvel article"""
    serializer = ArticleSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_articles(request):
    """Récupère la liste de tous les articles"""
    articles = Article.objects.all()
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsOwnerOrAdmin])
def update_article(request, pk):
    """Met à jour un article (propriétaire ou admin uniquement)"""
    article = get_object_or_404(Article, pk=pk)
    
    # Vérifier les permissions au niveau objet
    permission = IsOwnerOrAdmin()
    if not permission.has_object_permission(request, None, article):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à modifier cet article'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ArticleSerializer(
        article, 
        data=request.data, 
        partial=True,
        context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsOwnerOrAdmin])
def delete_article(request, pk):
    """Supprime un article (propriétaire ou admin uniquement)"""
    article = get_object_or_404(Article, pk=pk)
    
    # Vérifier les permissions au niveau objet
    permission = IsOwnerOrAdmin()
    if not permission.has_object_permission(request, None, article):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à supprimer cet article'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    article.delete()
    return Response(
        {'message': 'Article supprimé avec succès'},
        status=status.HTTP_204_NO_CONTENT
    )