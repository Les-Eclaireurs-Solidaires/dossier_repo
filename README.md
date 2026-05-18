# Les Eclaireurs Solidaires [![Backend CI Pipeline](https://github.com/Les-Eclaireurs-Solidaires/dossier_repo/actions/workflows/ci.yml/badge.svg)](https://github.com/Les-Eclaireurs-Solidaires/dossier_repo/actions/workflows/ci.yml)

Le projet consiste à créer une palteforme de mise en relation entre Bénévoles et Organisateurs de Missions Bénévoles.

## Pour commencer

### Pré-requis

Afin de faire tourner le projet localement, seuls ces deux outils sont nécessaires :

- [Docker](https://www.docker.com/) (et Docker Compose)
- [Git](https://git-scm.com/)

### Stack-Technique

- **Backend :** API Node.js / Express 5 / TypeScript (Architecture Orientée Objet)
- **Frontend :** Angular 21 (Mode SSR)
- **Base de données :** MySQL 9.0
- **Orchestration :** Docker & Docker Compose
- **CI/CD :** GitHub Actions

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

_Pensez à modifier les fichiers .env générés avec vos variables d'environnement_ 4. Lancer la plateforme via Docker (Base de données, API et Client SSR)

```
docker-compose up --build
```

## Accès locaux

- Frontend (Angular) : http://localhost:4200
- Backend (API REST) : http://localhost:3000/api
- Documentation API (Swagger) : http://localhost:3000/api-docs
- Interface Base de donnée (phpMyAdmin) : http://localhost:8080

## Architecture

- /backend : API REST
- /frontend : Client Angular
- /db : Scripts d'initialisation de la base de données
- .github/workflows : Pipeline d'Intégration Continue
  - Backend CI Pipeline : Analyse de conformité TypeScript et exécution automatisée des tests unitaires (Vitest) à chaque push sur `main` et sur les branches de fonctionnalités (`feature/*`)

### Module d'Inscription (Register)

Le processus d'inscription a été conçu avec une séparation stricte des responsabilités entre le client et le serveur :

#### 1. Front-End (Angular 21 & SSR)

- **Formulaires Réactifs Natifs :**
- **Validation Transversale Générique :** Création d'une "Validator Factory" (`matchFieldsValidator`) applicable au `FormGroup` pour comparer dynamiquement les mots de passe (ou tout autre champ double) avec une mise à jour réactive.
- **Gestion d'État par Signals :** L'UI réagit instantanément via des signaux calculés (`computed`) dans l'`AuthStateService`, découplant totalement la logique métier des composants visuels. L'état global est mis à jour de manière réactive via les opérateurs RxJS (`tap`).
- **Notifications Natives :** Implémentation d'un `NotificationService` basé sur les Signals pour un retour utilisateur (Toasts) sans bloquer le flux de navigation.

#### 2. Back-End (Node.js/Express)

- **Transformation et Validation DTO :** Utilisation combinée de `class-validator` et `class-transformer` (@Transform) pour assainir les données entrantes.
- **Sécurité des Tokens :** Le Front-end est volontairement "aveugle" concernant la sécurité. L'API renvoie uniquement les données utilisateur en JSON (email, rôle, uuid). Les jetons d'accès (Access & Refresh Tokens) sont injectés directement dans des cookies `HttpOnly`, les protégeant contre les attaques XSS.
- **Architecture POO :** L'insertion en base de données respecte les principes SOLID.

## 📖 Documentation de l'API (Contrat d'interface)

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
