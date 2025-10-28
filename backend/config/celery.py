from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Définit le fichier de configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

# Charge la configuration depuis settings.py avec préfixe CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Découvre automatiquement les tâches dans toutes les apps Django
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
