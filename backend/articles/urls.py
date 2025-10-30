from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ArticleViewSet, basename='article')

urlpatterns = [
    path('list/', views.list_articles, name='list_articles'),
    path('create/', views.create_article, name='create_article'),
    path('<int:pk>/update/', views.update_article, name='update_article'),
    path('<int:pk>/delete/', views.delete_article, name='delete_article'),
]