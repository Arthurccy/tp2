# users/permissions.py
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission pour vérifier que l'utilisateur a le rôle 'admin' OU est superuser
    """
    message = "Vous devez être administrateur pour effectuer cette action."
    
    def has_permission(self, request, view):
        # Vérifie si l'utilisateur est authentifié ET (role='admin' OU is_superuser=True)
        return (
            request.user 
            and request.user.is_authenticated 
            and (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Les admins/superusers peuvent tout faire, les autres uniquement lire (GET, HEAD, OPTIONS)
    """
    def has_permission(self, request, view):
        # Lecture autorisée pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Écriture: seulement admin ou superuser
        return (
            request.user 
            and request.user.is_authenticated 
            and (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Seul le propriétaire, un admin (role='admin') ou un superuser peut modifier/supprimer
    """
    message = "Vous n'êtes pas autorisé à modifier cette ressource."
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Vérifier que l'objet a bien un attribut 'author'
        if not hasattr(obj, 'author'):
            return False
        
        # Écriture: propriétaire, admin ou superuser
        return (
            obj.author == request.user 
            or request.user.role == 'admin' 
            or request.user.is_superuser
        )


class IsOwnerOrAdminForUser(permissions.BasePermission):
    """
    Pour les ressources User: l'utilisateur ne peut voir/modifier que son propre profil,
    sauf si c'est un admin (role='admin') ou un superuser
    """
    message = "Vous n'êtes pas autorisé à accéder à ce profil."
    
    def has_object_permission(self, request, view, obj):
        # Admin ou superuser peut tout faire
        if request.user.role == 'admin' or request.user.is_superuser:
            return True
        
        # Un utilisateur peut seulement accéder à son propre profil
        return obj == request.user