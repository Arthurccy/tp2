from celery import shared_task
from django.core.mail import EmailMessage

@shared_task
def send_email_async(subject, body, to_email):
    print("===> Celery task running !")
    email = EmailMessage(
        subject=subject,
        body=body,
        to=[to_email],
    )
    email.send()
    return f"Email envoyé à {to_email}"


@shared_task
def send_reset_password_email(subject, body, to_email):
    email = EmailMessage(subject=subject, body=body, to=[to_email])
    email.send()
    return f"Email envoyé à {to_email}"
