from django.http import JsonResponse
from django.core.exceptions import PermissionDenied

def api_permission_required(perm, required_role=None):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            # ... (Vérification de l'authentification - 401) ...
            
            # --- Nouvelle vérification de RÔLE ---
            if required_role and request.user.role != required_role:
                 return JsonResponse({'error': 'Rôle utilisateur insuffisant.'}, status=403)
            # --- Fin de la vérification de RÔLE ---
            
            # ... (Vérification de la permission Django - 403) ...
            if not request.user.has_perm(perm):
                return JsonResponse({'error': 'Permission insuffisante.'}, status=403)
                
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator