# Dans un nouveau fichier appelé 'pagination.py' ou au début de views.py
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    """
    Définit le style de pagination : 10 articles par page par défaut.
    L'utilisateur peut demander plus ou moins via le paramètre 'page_size'.
    """
    page_size = 10 
    page_size_query_param = 'page_size' # Permet de changer la taille de la page (ex: ?page_size=20)
    max_page_size = 100 # Taille maximale autorisée