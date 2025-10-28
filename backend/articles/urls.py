from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.list_articles, name='list_articles'),
    path('articles/create/', views.create_article, name='create_article'),
    path('articles/<int:pk>/update/', views.update_article, name='update_article'),
    path('articles/<int:pk>/delete/', views.delete_article, name='delete_article'),
]