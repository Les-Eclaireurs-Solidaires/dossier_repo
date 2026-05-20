# Les Eclaireurs Solidaires [![Backend CI Pipeline](https://github.com/Les-Eclaireurs-Solidaires/dossier_repo/actions/workflows/ci.yml/badge.svg)](https://github.com/Les-Eclaireurs-Solidaires/dossier_repo/actions/workflows/ci.yml)

Une association gère aujourd'hui ses missions bénévoles manuellement — emails, tableurs, appels téléphoniques. L'objectif est de centraliser ce processus sur une plateforme web accessible à trois types d'acteurs : les bénévoles qui cherchent des missions, les organisateurs qui les créent et les gèrent, et un super-administrateur qui supervise l'ensemble.  
Ce projet a été réalisé seul, en autonomie complète, dans le cadre de la validation de formation DWWM, en remplacement d'un stage qui n'a pu aboutir.

## Fonctionnalités

### Authentification 

#### Inscription (Register)

- Choix du rôle du compte à créer via URL params `role`
- Création de compte avec validation en temps réel des champs
- Vérification de correspondance des mots de passe
- Notification de succès ou d'erreur sans rechargement de page via une snackbar
- Pour le moment le Register entraîne une connection automatique
- Connexion sécurisée via tokens JWT (Access & Refresh Tokens) stockés en cookies HttpOnly (Protection XSS)
- Aucunes données sensibles sont stockées en clair et sont occultées côté client

#### Connexion (Login)

- Connexion à un compte existant
- Vérification de l'email et de la correspondance des mots de passe
- Notification via la snackbar de succès ou d'erreur
- Connexion sécurisée via tokens JWT

#### Déconnexion (Logout)
- Révocation sécurisée de la session utilisateur.
- Suppression côté client des cookies `HttpOnly` contenant les jetons JWT pour garantir la fermeture totale des accès.

#### Rafraîchissement du Token (Refresh)
- Mécanisme de rotation transparente des jetons (Access Token valide 15 min, Refresh Token valide 7 jours).
- Interception automatique des erreurs `401 Unauthorized` pour demander un nouveau token sans interrompre la navigation de l'utilisateur.

#### Données du Profile Utilisateur (GetUser)
- Récupération des informations de l'utilisateur connecté via l'API sécurisée.
- Hydratation de l'état global du Front-end (via Angular Signals) pour un affichage réactif du profil et des droits (Rôles) à travers toute l'application.

#### Récupération de Compte (Forgot / Reset Password)

- Demande de réinitialisation sécurisée par email (génération de token à usage unique, valide 15 minutes).
- **Note de développement :** L'envoi réel de l'email est actuellement simulé (mocké) dans la console du backend en attendant l'intégration d'un service SMTP.
- Approche de "sécurité silencieuse" pour éviter les failles d'énumération d'adresses email.
- Formulaire dynamique côté client avec validation croisée des mots de passe.

### Gestion des Missions
(à)

## Stack-Technique

- **Backend :** API Node.js / Express 5 / TypeScript (Architecture Orientée Objet)
- **Frontend :** Angular 21 (Mode SSR)
- **Base de données :** MySQL 9.0
- **Orchestration :** Docker & Docker Compose
- **CI/CD :** GitHub Actions

## Pour commencer

### Pré-requis

Afin de faire tourner le projet localement, seuls ces deux outils sont nécessaires :

- [Docker](https://www.docker.com/) (et Docker Compose)
- [Git](https://git-scm.com/)

### Installation et Démarrage du projet

_Exécutez les commandes suivantes dans votre terminal_

1. Clôner le repo Git

```
git clone https://github.com/Les-Eclaireurs-Solidaires/dossier_repo.git
```

2. Placez vous dans le dossier ainsi extrait

```
cd dossier_repo
```

3. Configurer les variables d'environnement dans les dossiers backend et frontend

```
cp .env.example .env
```

_Pensez à modifier les fichiers .env générés avec vos variables d'environnement_

4. Lancer la plateforme via Docker (Base de données, API et Client SSR)

```
docker-compose up --build
```

## Variables d'environnement

Les variables d'environnement sont réparties en **3 fichiers** à créer depuis les `.env.example` correspondants

### `.env` (Racine - Docker Compose)

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Exemple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HOST_BACKEND_PORT</td>
      <td>Prot exposé par Docker pour l'API</td>
      <td>3000</td>
    </tr>
    <tr>
      <td>HOST_FRONTEND_PORT</td>
      <td>Port exposé par Docker pour le Frontend</td>
      <td>4200</td>
    </tr>
    <tr>
      <td>DB_NAME</td>
      <td>Nom de la base de données</td>
      <td>les_eclaireurs_solidaires</td>
    </tr>
    <tr>
      <td>DB_PASSWORD</td>
      <td>Mot de passe de la base de données partagé avec le backend</td>
      <td>ton_mot_de_passe_secret</td>
    </tr>
  </tbody>
</table>

### `backend/.env`

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Exemple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>BACKEND_PORT</td>
      <td>Port d'écoute interne de l'API</td>
      <td>3000</td>
    </tr>
    <tr>
      <td>BACKEND_NODE_ENV</td>
      <td>Environnement Node.js</td>
      <td>development</td>
    </tr>
    <tr>
      <td>BACKEND_HOST</td>
      <td>Adresse d'écoute de l'API</td>
      <td>0.0.0.0</td>
    </tr>
    <tr>
      <td>DB_HOST</td>
      <td>Nom du service MySQL dans Docker Compose</td>
      <td>mysql</td>
    </tr>
    <tr>
      <td>DB_USER</td>
      <td>Utilisateur MySQL</td>
      <td>root</td>
    </tr>
    <tr>
      <td>DB_PASSWORD</td>
      <td>Mot de passe MySQL partagé</td>
      <td>ton_mot_de_passe_secret</td>
    </tr>
    <tr>
      <td>DB_NAME</td>
      <td>Nom de la base de données</td>
      <td>les_eclaireurs_solidaires</td>
    </tr>
    <tr>
      <td>DB_PORT</td>
      <td>Port MySQL interne</td>
      <td>3306</td>
    </tr>
    <tr>
      <td>JWT_ACCESS_SECRET</td>
      <td>Clé de signature de l'Access Token</td>
      <td>-</td>
    </tr>
    <tr>
      <td>JWT_REFRESH_SECRET</td>
      <td>Clé de signature du Refresh Token</td>
      <td>-</td>
    </tr>
    <tr>
      <td>JWT_ACCESS_EXPIRES_IN</td>
      <td>Durée de validité de l'Access Token</td>
      <td>15m</td>
    </tr>
    <tr>
      <td>JWT_REFRESH_EXPIRES_IN</td>
      <td>Durée de validité du Refresh Token</td>
      <td>7d</td>
    </tr>
  </tbody>
</table>

### `frontend/.env`

<table>
  <thead> 
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Exemple</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PORT</td>
      <td>Port d'écoute du serveur SSR Angular</td>
      <td>4000</td>
    </tr>
    <tr>
      <td>NODE_ENV</td>
      <td>Environnement Node.js</td>
      <td>development</td>
    </tr>
    <tr>
      <td>API_URL</td>
      <td>URL interne Docker de l'API</td>
      <td>http://backend:3000/api</td>
    </tr> 
  </tbody>
</table>

`DB_PASSWORD` doit être identique dans `.env` et `backend/.env`  
Ne jamais committer les secret JWT - vous pouvez les générer avec `openssl rand -base64 32`

## Accès locaux

- Frontend (Angular) : http://localhost:4200
- Backend (API REST) : http://localhost:3000/api
- Documentation API (Swagger) : http://localhost:3000/api-docs
- Interface Base de donnée (phpMyAdmin) : http://localhost:8080

## Architecture

### Structure du dépôt

- /backend : API REST
- /frontend : Client Angular
- /db : Scripts d'initialisation de la base de données
- .github/workflows : Pipeline d'Intégration Continue
  - Backend CI Pipeline : Analyse de conformité TypeScript et exécution automatisée des tests unitaires (Vitest) à chaque push sur `main` et sur les branches de fonctionnalités (`feature/*`)

### Sécurité et Architecture

- **Rate Limiting** : Protection anti-brute force stricte sur les endpoints publics d'authentification (10 requêtes / 15 min) et souple sur la navigation (1000 requêtes).
- **Support Proxy** : Configuration `trust proxy` pour gérer l'identification des IP derrière Docker.
- **Routage Protégé (Guards)** : Redirection automatique des utilisateurs déjà authentifiés loin des pages de connexion (`guestGuard`), et sécurisation des routes privées (`authGuard`).
- **CORS** : Restriction des origines autorisées à interroger l'API (liste blanche d'URLs), empêche les requêtes cross-origin non sollicitées.
- **Helmet** : A CONFIGURER
- **Layout Unifié** : Architecture Front-end DRY avec un `AuthenticationPage` centralisant l'UI de tous les formulaires.

## 📖 Documentation de l'API (Contrat d'interface)

### EndPoints principaux
TABLEAU A VENIR

### Swagger

L'API est entièrement documentée en respectant la spécification **OpenAPI 3.0**.
Lorsque les conteneurs Docker sont démarrés, la documentation interactive Swagger UI est accessible sur :
**http://localhost:3000/api-docs**

Elle permet de consulter :

- Les points d'entrée (Endpoints) disponibles (ex: `/auth/register`).
- Les structures de données attendues (DTOs) et les formats de validation (`class-validator`).
- Le cycle complet des réponses HTTP (200 OK, 400 Bad Request, 401 Unauthenticated, 409 Conflict, 500 Server Error).

## Stratégie de Test

La logique métier est protégée par des tests unitaires isolés (Vitest).  
Cette approche garantit la stabilité des règles applicatives sans dépendre d'une base de données active grâce au Mocking
des dépôts.

### Exécution des tests (Vitest)

- **En Local**

```
cd backend
npm run test
```

- **Dans l'environnement Docker**

```
docker-compose exec backend npm run test -- --run
```
