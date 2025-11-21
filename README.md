👤 Auteur

Projet réalisé par Victor, Arthur et Mathias dans le cadre du TP1 - Gestion de Contenu (Next.js / TypeScript / Zustand).

📄 Licence

Ce projet est libre d’utilisation dans le cadre académique.
Aucune restriction de diffusion, à condition de citer la source d’origine.


Lancer Redis et Celery : 
Aller dans le dossier redis de votre pc (C:\Program Files\Redis), puis lancer redis dans un cmd "./redis-server.exe"
Ensuite lancer le worker celery depuis le backend avec eventlet "celery -A config worker -l info -P  eventlet"
Puis vous pouvez tester la task d'envoie d'email dans le shell de django : 
 - python manage.py shell
 >> from users.tasks import send_email_async
 >> send_email_async.delay('Test Celery', 'Asynchrone Gmail OK ✅', 'tonemail')

 Lancer flower :
 avoir son serveur redis en écoute
 Lancer le worker celery : "celery -A config worker -l info -P  eventlet"
 Puis flower : celery -A config flower --port=5555 ( éditez le port si besoin )
 Puis accéder à la page web de Flower : http://localhost:5555/ ( avec le port que vous avez spécifiez dans la commande précédente)


Commandes pour démarrer le service : 

cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
pytest #Pour lancer les test

Lien du déploiement : https://tp2-rpcw.onrender.com
OpenAPI : https://tp2-rpcw.onrender.com/api/docs/ 
https://tp2-rpcw.onrender.com/api/redoc/ 
