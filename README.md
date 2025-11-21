# GALAND Plomberie - Système de Gestion d'Interventions

Application web complète pour la gestion des interventions de plomberie, incluant la gestion des clients, des rapports d'intervention, du stock et du calendrier.

## Fonctionnalités

### 📊 Tableau de bord
- Vue d'ensemble des statistiques (interventions du mois, clients actifs, revenus)
- Interventions urgentes en attente
- Résumé global de l'activité

### 🔧 Gestion des interventions
- Créer, modifier et supprimer des rapports d'intervention
- Informations détaillées : date, heure, client, type, description du problème
- Suivi des travaux effectués et pièces utilisées
- Calcul automatique des coûts (main d'œuvre + matériaux)
- Statuts : planifiée, en cours, terminée, facturée
- Marquage des interventions urgentes
- **Génération automatique de PDF** pour envoi aux clients

### 👥 Base de données clients
- Fiches clients complètes (nom, contact, adresse)
- Historique des interventions par client
- Recherche et filtres avancés

### 📦 Gestion du stock
- Liste complète des pièces et matériaux
- Suivi des quantités en stock
- **Alertes automatiques** pour les stocks faibles
- Prix unitaires et catégories

### 📅 Calendrier
- Vue mensuelle des interventions planifiées
- Code couleur par statut
- Détails par jour
- Attribution aux plombiers (si équipe)

## Stack Technique

### Backend
- **Node.js** + **Express** - Serveur API REST
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **bcrypt** - Hashage des mots de passe
- **PDFKit** - Génération de PDF

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS moderne
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Heroicons** - Icônes
- **date-fns** - Manipulation de dates

## Installation

### Prérequis

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** ou **yarn**

### 1. Cloner le projet

```bash
cd galand-plomberie
```

### 2. Configuration de la base de données

#### Installer PostgreSQL

Si PostgreSQL n'est pas installé :
- **Windows** : Télécharger depuis [postgresql.org](https://www.postgresql.org/download/windows/)
- **Linux** : `sudo apt-get install postgresql`
- **macOS** : `brew install postgresql`

#### Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE galand_plomberie;

# Quitter
\q
```

#### Initialiser le schéma

```bash
cd backend
psql -U postgres -d galand_plomberie -f src/database/schema.sql
```

### 3. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos paramètres
# Modifier au minimum :
# - DB_PASSWORD (votre mot de passe PostgreSQL)
# - JWT_SECRET (générer une clé secrète aléatoire)
```

**Fichier `.env` :**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=galand_plomberie
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### 4. Configuration du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Créer un fichier .env (optionnel)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 5. Lancer l'application

#### Option 1 : Lancer séparément

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

Le serveur backend démarre sur http://localhost:5000

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

Le frontend démarre sur http://localhost:3000

#### Option 2 : Script de démarrage (Windows)

Créer un fichier `start.bat` à la racine :
```batch
@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
```

### 6. Accéder à l'application

Ouvrir http://localhost:3000 dans votre navigateur

**Compte par défaut :**
- Email : `admin@galand-plomberie.fr`
- Mot de passe : `admin123`

⚠️ **Important** : Changez ce mot de passe en production !

## Structure du projet

```
galand-plomberie/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, etc.)
│   │   ├── database/        # Schémas SQL
│   │   ├── middleware/      # Middlewares (auth)
│   │   ├── routes/          # Routes API
│   │   │   ├── auth.routes.ts
│   │   │   ├── clients.routes.ts
│   │   │   ├── interventions.routes.ts
│   │   │   ├── inventory.routes.ts
│   │   │   ├── statistics.routes.ts
│   │   │   └── pdf.routes.ts
│   │   ├── types/           # Types TypeScript
│   │   └── server.ts        # Point d'entrée
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   └── Layout.tsx
│   │   ├── context/         # Context API (Auth)
│   │   │   └── AuthContext.tsx
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Interventions.tsx
│   │   │   ├── InterventionForm.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   ├── Inventory.tsx
│   │   │   └── Calendar.tsx
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── types/           # Types TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── README.md
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Interventions
- `GET /api/interventions` - Liste des interventions
- `GET /api/interventions/:id` - Détails d'une intervention
- `POST /api/interventions` - Créer une intervention
- `PUT /api/interventions/:id` - Modifier une intervention
- `DELETE /api/interventions/:id` - Supprimer une intervention

### Inventaire
- `GET /api/inventory` - Liste des articles
- `GET /api/inventory/low-stock` - Articles en stock faible
- `GET /api/inventory/:id` - Détails d'un article
- `POST /api/inventory` - Créer un article
- `PUT /api/inventory/:id` - Modifier un article
- `DELETE /api/inventory/:id` - Supprimer un article

### Statistiques
- `GET /api/statistics` - Vue d'ensemble
- `GET /api/statistics/monthly-revenue` - Revenus mensuels
- `GET /api/statistics/interventions-by-type` - Par type

### PDF
- `GET /api/pdf/:id` - Générer le PDF d'une intervention

## Build pour la production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Les fichiers sont générés dans `frontend/dist/`

## Déploiement

### Option 1 : Serveur VPS (recommandé)

1. **Préparer le serveur**
```bash
# Installer Node.js, PostgreSQL, Nginx
sudo apt update
sudo apt install nodejs npm postgresql nginx
```

2. **Configurer PostgreSQL**
```bash
sudo -u postgres createdb galand_plomberie
sudo -u postgres psql galand_plomberie < backend/src/database/schema.sql
```

3. **Déployer le backend**
```bash
cd backend
npm install
npm run build
pm2 start dist/server.js --name galand-api
```

4. **Déployer le frontend**
```bash
cd frontend
npm install
npm run build
# Copier dist/ vers /var/www/galand-plomberie
sudo cp -r dist/* /var/www/galand-plomberie/
```

5. **Configurer Nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        root /var/www/galand-plomberie;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2 : Services Cloud

- **Frontend** : Vercel, Netlify, Cloudflare Pages
- **Backend** : Heroku, Railway, Render
- **Base de données** : Supabase, Neon, Railway PostgreSQL

## Sécurité

### En production, assurez-vous de :

1. ✅ Changer le mot de passe admin par défaut
2. ✅ Utiliser HTTPS (certificat SSL)
3. ✅ Modifier `JWT_SECRET` avec une clé forte
4. ✅ Configurer les CORS correctement
5. ✅ Activer les sauvegardes PostgreSQL
6. ✅ Utiliser des variables d'environnement sécurisées
7. ✅ Limiter les tentatives de connexion (rate limiting)

## Développement

### Commandes utiles

```bash
# Backend
cd backend
npm run dev          # Mode développement
npm run build        # Compiler TypeScript
npm start           # Démarrer en production

# Frontend
cd frontend
npm run dev         # Mode développement
npm run build       # Build pour production
npm run preview     # Prévisualiser le build
```

### Ajouter de nouvelles fonctionnalités

1. **Nouvelle route API** : Ajouter dans `backend/src/routes/`
2. **Nouvelle page** : Ajouter dans `frontend/src/pages/`
3. **Nouveau composant** : Ajouter dans `frontend/src/components/`

## Dépannage

### Erreur de connexion à la base de données
```bash
# Vérifier que PostgreSQL est lancé
sudo service postgresql status

# Vérifier les credentials dans .env
```

### Port déjà utilisé
```bash
# Changer le port dans backend/.env (PORT=5001)
# Et dans frontend/.env (VITE_API_URL=http://localhost:5001/api)
```

### Erreur CORS
```bash
# Vérifier CORS_ORIGIN dans backend/.env
CORS_ORIGIN=http://localhost:3000
```

## Licence

MIT License - Libre d'utilisation pour votre entreprise

## Support

Pour toute question ou problème :
- 📧 Email : contact@galand-plomberie.fr
- 📝 Issues : Créer une issue sur le dépôt

---

**Développé avec ❤️ pour l'Entreprise GALAND Plomberie**
