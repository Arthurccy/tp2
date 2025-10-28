from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

token_generator = PasswordResetTokenGenerator()

def generate_password_reset_link(user, frontend_base_url):
    """
    Crée un lien de reset du mot de passe.
    frontend_base_url est l'URL de ton frontend (ex: http://localhost:3000/reset-password)
    """
    from django.utils.http import urlsafe_base64_encode
    from django.utils.encoding import force_bytes
    
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    
    return f"{frontend_base_url}/{uidb64}/{token}/"
