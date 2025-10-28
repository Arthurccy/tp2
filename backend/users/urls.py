from django.urls import path
from . import views

urlpatterns = [
    path('auth/inscription/', views.inscription_user, name='inscription'),
    path('auth/connexion/', views.connexion_user, name='connexion'),
    path('auth/deconnexion/', views.deconnexion_user, name='deconnexion'),

    path('creer/', views.creer_user, name='creer_user'),
    path('liste/', views.liste_users, name='liste_users'),
    path('modifier/<int:user_id>/', views.modifier_user, name='modifier_user'),
    path('supprimer/<int:user_id>/', views.supprimer_user, name='supprimer_user'),
]