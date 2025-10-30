from django.db import models
from django.conf import settings


class Article(models.Model):
    """Modèle représentant un article de blog"""
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    content = models.TextField(verbose_name="Contenu")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='articles',
        verbose_name="Auteur"
    )
    
    # ✅ Ajoutez ces champs de timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        db_table = 'articles'
        ordering = ['-created_at']  # Plus récents en premier
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
    
    def __str__(self):
        return f"{self.title} - {self.author.username}"