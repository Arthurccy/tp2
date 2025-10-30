from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_articles, name='list_articles'),
    path('create/', views.create_article, name='create_article'),
    path('<int:pk>/update/', views.update_article, name='update_article'),
    path('<int:pk>/delete/', views.delete_article, name='delete_article'),
]