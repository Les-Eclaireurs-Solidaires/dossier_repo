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
*Exécutez les commandes suivantes dans votre terminal*
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
*Pensez à modifier les fichiers .env générés avec vos variables d'environnement*
4. Lancer la plateforme via Docker (Base de données, API et Client SSR)
```
docker-compose up --build
```

### Accès locaux
- Frontend (Angular) : http://localhost:4200
- Backend (API REST) : http://localhost:3000/api
- Documentation API (Swagger) : http://localhost:3000/api-docs
- Interface Base de donnée (phpMyAdmin) : http://localhost:8080

### Architecture
- /backend : API REST
- /frontend : Client Angular
- /db : Scripts d'initialisation de la base de données
- .github/workflows : Pipeline d'Intégration Continue 
  - Backend CI Pipeline : Analyse de conformité TypeScript et exécution automatisée des tests unitaires (Vitest) à chaque push sur `main` et sur les branches de fonctionnalités (`feature/*`) 

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
