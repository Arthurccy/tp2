from rest_framework import serializers
from .models import Article
from django.contrib.auth import get_user_model

User = get_user_model()


class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False
    )
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'author', 'author_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author_username', 'created_at', 'updated_at']

    def validate_title(self, value):
        """Validation personnalisée du titre"""
        if len(value) < 5:
            raise serializers.ValidationError("Le titre doit contenir au moins 5 caractères")
        return value

    def validate_content(self, value):
        """Validation personnalisée du contenu"""
        if len(value) < 20:
            raise serializers.ValidationError("Le contenu doit contenir au moins 20 caractères")
        return value
    
    def create(self, validated_data):
        """Création d'un article"""
        return Article.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """
        Mise à jour : empêche la modification de l'auteur
        """
        # Retire 'author' des données validées
        validated_data.pop('author', None)
        
        # Met à jour les champs autorisés
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()  # updated_at sera automatiquement mis à jour grâce à auto_now=True
        
        return instance
    
    