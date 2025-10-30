from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Article
from .serializers import ArticleSerializer
from users.permissions import IsOwnerOrAdmin, IsAdminOrReadOnly


# ========================================
# 🔧 ViewSet (pour les routes automatiques)
# ========================================
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


# ========================================
# ➕ CRÉER UN ARTICLE
# ========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_article(request):
     """
    Crée un nouvel article.
    
    Réponses HTTP:
        201: Article créé avec succès
        400: Erreur de validation (titre/contenu invalide)
        401: Utilisateur non authentifié
    """

    serializer = ArticleSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = request.data.copy()
    data['author'] = request.user.id
    serializer = ArticleSerializer(data=data)
    
    # ❌ Validation échouée
    if not serializer.is_valid():
        return Response({
            "error": "Erreur de validation des données",
            "status_code": status.HTTP_400_BAD_REQUEST,
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Sauvegarde avec l'auteur connecté
    serializer.save()
    
    return Response({
        "message": "Article créé avec succès",
        "status_code": status.HTTP_201_CREATED,
        "data": {
            "article": serializer.data
        }
    }, status=status.HTTP_201_CREATED)


# ========================================
# 📄 LISTE DES ARTICLES
# ========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_articles(request):
     """
    Récupère la liste de tous les articles.
    
    Réponses HTTP:
        200: Liste des articles récupérée
    """

    articles = Article.objects.all()
    articles = Article.objects.all().order_by('-created_at')
    serializer = ArticleSerializer(articles, many=True)
    
    return Response({
        "message": "Articles récupérés avec succès",
        "status_code": status.HTTP_200_OK,
        "data": {
            "count": articles.count(),
            "articles": serializer.data
        }
    }, status=status.HTTP_200_OK)

# ========================================
# ✏️ MODIFIER UN ARTICLE
# ========================================
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_article(request, pk):
    """
    Met à jour un article existant.
    
    Réponses HTTP:
        200: Article modifié avec succès
        400: Erreur de validation
        403: L'utilisateur n'est pas l'auteur
        404: Article introuvable
    """

    permission = IsOwnerOrAdmin()
    if not permission.has_object_permission(request, None, article):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à modifier cet article'},
            status=status.HTTP_403_FORBIDDEN
        )

    # ❌ Vérifie que l'article existe
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response({
            "error": "Article introuvable",
            "status_code": status.HTTP_404_NOT_FOUND,
            "details": {
                "article_id": pk
            }
        }, status=status.HTTP_404_NOT_FOUND)
    
    # ❌ Vérifie que l'utilisateur est l'auteur
    if article.author != request.user:
        return Response({
            "error": "Vous n'avez pas la permission de modifier cet article",
            "status_code": status.HTTP_403_FORBIDDEN,
            "details": {
                "article_id": pk,
                "article_author": article.author.username,
                "current_user": request.user.username
            }
        }, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data['author'] = request.user.id

    # Validation des données (partial=True pour PATCH)
    partial = request.method == 'PATCH'
    serializer = ArticleSerializer(article, data=data, partial=partial)
    
    # ❌ Erreur de validation
    if not serializer.is_valid():
        return Response({
            "error": "Erreur de validation des données",
            "status_code": status.HTTP_400_BAD_REQUEST,
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # ✅ Mise à jour réussie
    serializer.save()
    
    return Response({
        "message": "Article modifié avec succès",
        "status_code": status.HTTP_200_OK,
        "data": {
            "article": serializer.data
        }
    }, status=status.HTTP_200_OK)


# ========================================
# 🗑️ SUPPRIMER UN ARTICLE
# ========================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_article(request, pk):
    """
    Supprime un article existant.
    
    Réponses HTTP:
        200: Article supprimé avec succès
        403: L'utilisateur n'est pas l'auteur
        404: Article introuvable
    """

    permission = IsOwnerOrAdmin()
    if not permission.has_object_permission(request, None, article):
        return Response(
            {'error': 'Vous n\'êtes pas autorisé à supprimer cet article'},
            status=status.HTTP_403_FORBIDDEN
        )

    # ❌ Vérifie que l'article existe
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response({
            "error": "Article introuvable",
            "status_code": status.HTTP_404_NOT_FOUND,
            "details": {
                "article_id": pk
            }
        }, status=status.HTTP_404_NOT_FOUND)
    
    # ❌ Vérifie que l'utilisateur est l'auteur
    if article.author != request.user:
        return Response({
            "error": "Vous n'avez pas la permission de supprimer cet article",
            "status_code": status.HTTP_403_FORBIDDEN,
            "details": {
                "article_id": pk,
                "article_author": article.author.username,
                "current_user": request.user.username
            }
        }, status=status.HTTP_403_FORBIDDEN)
    
    # ✅ Sauvegarde les infos avant suppression
    article_data = ArticleSerializer(article).data
    article.delete()
    
    return Response({
        "message": "Article supprimé avec succès",
        "status_code": status.HTTP_200_OK,
        "data": {
            "deleted_article": article_data
        }
    }, status=status.HTTP_200_OK)
