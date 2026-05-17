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
- Interface Base de donnée (phpMyAdmin) : http://localhost:8080

### Architecture
- /backend : API REST
- /frontend : Client Angular
- /db : Scripts d'initialisation de la base de données
- .github/workflows : Pipeline d'Intégration Continue 
  - Backend CI Pipeline : Vérification TypeScript à chaque push sur main 

### Routes Exposées
*Documentation de l'API à venir (Swagger)*
- GET /api : route de test de santé de l'API
- GET /api/missions : Récupérer la liste des missions
- GET /api/missions/:id : Récupérer le détail d'une mission
