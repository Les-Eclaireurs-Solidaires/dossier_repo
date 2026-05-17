# Dépendances (deps)
# Créer une boîte de base avec tous les outils nécessaire à Angular
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install

# Boite de développement
# Angular classique avec rechargement a chaud
FROM node:22-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# On expose le port 4200, port par défaut de ng serve
EXPOSE 4200
# on lance la commande start
CMD ["npm", "start"]

# Boite de compilation
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# on genere le dossier /dist specifique a Angular SSR
# recuperer les chemins générés pour le boîte de production
RUN npm run build

# Boite de production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# on recupere l'application compilée
COPY --from=builder /app/dist ./dist/ 
COPY --from=builder /app/package*.json ./
# on installe seulement ce dont on a besoin en production
RUN npm ci --omit=dev
# pour la sécurité on force les droits d'un utilisateur par défaut sur le serveur
# en cas de piratage, pas de droit admin sur la machine
USER node
# on expose le port 4000, port d'écoute du serveur SSR d'Angular
EXPOSE 4000
# on lance le serveur généré par Angular pour servir les pages pré-rendues
# chemin a verifier lors de la compilation
CMD ["node", "dist/client/server/server.mjs"]
