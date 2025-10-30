from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour l'affichage et la modification des utilisateurs"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'sujet', 'pp', 'role', 'is_staff', 'is_active', 
                  'is_superuser', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def update(self, instance, validated_data):
        # Empêcher les utilisateurs non-admin de changer leur rôle
        request = self.context.get('request')
        if request and request.user.role != 'admin':
            validated_data.pop('role', None)
            validated_data.pop('is_staff', None)
            validated_data.pop('is_superuser', None)
        
        return super().update(instance, validated_data)


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'utilisateurs par l'admin"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name',
                  'sujet', 'pp', 'role', 'is_staff', 'is_active', 'is_superuser']
    
    def create(self, validated_data):
        # Vérifier que seul un admin peut créer un admin
        request = self.context.get('request')
        role = validated_data.get('role', 'user')
        
        if role == 'admin' and (not request or request.user.role != 'admin'):
            raise serializers.ValidationError("Seul un administrateur peut créer un utilisateur admin.")
        
        user = User.objects.create_user(**validated_data)
        return user


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription publique (rôle user uniquement)"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='user',
            is_active=True
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer pour changer le mot de passe"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer pour demander un reset de mot de passe"""
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer pour confirmer le reset de mot de passe"""
    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])