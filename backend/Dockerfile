# Dépendances (deps)
# Créer une boîte de base contenant uniquement les paquets téléchargés
FROM node:22-alpine AS deps
# version linux légère. Le fait d'ajouter libc6-compat permet d'éviter
# des bugs avec certaiens librairies natives Node.js avec Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
# on copie seulement les fichiers listant les dépendances
COPY package*.json ./
# on installe toutes les dépendances
RUN npm install

# Boite pour le développement local
FROM node:22-alpine AS development
WORKDIR /app
# on récupère les node_modules téléchargés dans la première boîte
COPY --from=deps /app/node_modules ./node_modules
# on copie tout le reste du code
COPY . .
# on indique que l'application écoute le port 3000
EXPOSE 3000
# commande lancé au démarrage de la boîte 
CMD ["npm", "run", "dev"]

# Boite de compilation
# on transforme le ts en js compréhensible de node.js
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# on lance la compilation
RUN npm run build

# Boite de production prête pour le serveur
FROM node:22-alpine AS production
WORKDIR /app
# on force node.js à être en mode production pour des questions de performances
ENV NODE_ENV=production
# on récupère que le dossier /dist compilé dans le builder
COPY --from=builder /app/dist ./dist
# on copie les package.json pour pourvoir réinstaller la production
COPY --from=builder /app/package*.json ./
# on installe uniquement les dépendances de production ici pas de typescript
# ou autre chose propre au dev
RUN npm ci --omit=dev
# pour la sécurité on force les droits d'un utilisateur par défaut sur le serveur
# en cas de piratage, pas de droit admin sur la machine
USER node
EXPOSE 3000
# on exécute directement le JavaScript compilé
CMD ["node", "dist/index.js"]


# à cela nous devons faire un fichier .dockerignore pour que nos dossiers
# locaux ne soient pas copiés et n'écrasent pas ainsi les conteneurs
