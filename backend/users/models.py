from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    
    sujet = models.CharField(max_length=200, blank=True, null=True)
    pp = models.CharField(max_length=255, blank=True, null=True)  # URL de la photo de profil
    role = models.CharField(max_length=5, choices=ROLES, default='user')
    
    # On hérite déjà de username, email, password de AbstractUser

    class Meta:
        db_table = 'users'