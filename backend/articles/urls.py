from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ArticleViewSet, basename='article')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', views.create_article, name='create_article'),
    path('list/', views.list_articles, name='list_articles'),
    path('update/<int:pk>/', views.update_article, name='update_article'),
    path('delete/<int:pk>/', views.delete_article, name='delete_article'),
]