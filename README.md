🧠 TP1 – Gestion de Contenu

Application web moderne réalisée avec Next.js 14, TypeScript, Zustand et TailwindCSS.
Ce projet met en œuvre une architecture front-end propre et modulaire pour gérer des utilisateurs et des articles, avec un système d’authentification et une interface responsive incluant un dark mode.

🚀 Objectif du projet

Le but de ce TP est de concevoir une application de gestion de contenu permettant :

🔐 Authentification locale (inscription et connexion avec stockage dans localStorage)

📰 Gestion des articles (création, suppression, filtrage, tri)

👥 Gestion des utilisateurs (visualisation, édition, rôles)

🌙 Mode clair / sombre automatique

💾 Persistance des données via Zustand (localStorage)
🧭 Navigation fluide avec Next.js App Router

🧱 Composants modulaires et design responsive moderne

🧩 Technologies utilisées

Outil / Framework	Rôle
⚡ Next.js 14	Framework React avec App Router
💻 TypeScript	Typage statique robuste
🎨 TailwindCSS	Design responsive et dark mode
🧠 Zustand	Gestion d’état légère et persistante
🧰 Lucide Icons	Icônes modernes pour l’UI
🧪 Jest + Testing Library	Tests unitaires
🌐 ESLint / Prettier	Qualité et cohérence du code


⚙️ Installation & Lancement local
🧰 Prérequis

Assure-toi d’avoir installé :

Node.js
 v18+

npm
 ou pnpm
 / [yarn]

1️⃣ Cloner le projet
git clone https://github.com/<ton-utilisateur>/<nom-du-projet>.git
cd <nom-du-projet>

2️⃣ Installer les dépendances
npm install
# ou
yarn install

3️⃣ Lancer le projet en mode développement
npm run dev


➡️ L’application sera disponible sur :
👉 http://localhost:3000

4️⃣ Lancer les tests unitaires
npm run test


🧪 Exécute les tests Jest configurés dans src/app/__tests__/.

5️⃣ Générer la build de production
npm run build
npm start

🔒 Authentification & Sécurité

Les utilisateurs sont stockés dans le store Zustand (localStorage).

Routes publiques : /pages/auth/login et /pages/auth/register

Toute autre route est protégée par le composant ProtectedRoute.

Un utilisateur déconnecté est automatiquement redirigé vers /pages/auth/login.

🌗 Dark Mode & Responsivité

Le dark mode est géré automatiquement via Tailwind (dark:).

L’interface est 100 % responsive, adaptée aux mobiles, tablettes et desktops.

🧠 Architecture Zustand

Chaque store (auth, user, article) utilise le pattern :

persist(
  (set, get) => ({ ... }),
  { name: "store-name", storage: createJSONStorage(() => localStorage) }
);


Cela permet :

la persistance automatique des données entre les sessions,

un rechargement instantané du contexte utilisateur.

🧪 Tests unitaires

Les tests utilisent :

Jest pour le framework de test

@testing-library/react pour les interactions UI


👤 Auteur

Projet réalisé par Victor, Arthur et Mathias dans le cadre du TP1 - Gestion de Contenu (Next.js / TypeScript / Zustand).

📄 Licence

Ce projet est libre d’utilisation dans le cadre académique.
Aucune restriction de diffusion, à condition de citer la source d’origine.