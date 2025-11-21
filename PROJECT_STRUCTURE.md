# Structure du Projet - GALAND Plomberie

## Arborescence complète

```
galand-plomberie/
│
├── 📄 README.md                      # Documentation principale
├── 📄 QUICK_START.md                 # Guide de démarrage rapide
├── 📄 FEATURES.md                    # Fonctionnalités détaillées
├── 📄 DATABASE.md                    # Documentation base de données
├── 📄 PROJECT_STRUCTURE.md           # Ce fichier
├── 📄 .gitignore                     # Fichiers ignorés par Git
├── 🦇 start.bat                      # Script de démarrage Windows
│
├── 📁 backend/                       # Serveur Node.js + Express
│   ├── 📄 package.json              # Dépendances backend
│   ├── 📄 tsconfig.json             # Configuration TypeScript
│   ├── 📄 nodemon.json              # Configuration Nodemon
│   ├── 📄 .env.example              # Template variables d'environnement
│   │
│   └── 📁 src/                      # Code source backend
│       │
│       ├── 📄 server.ts             # Point d'entrée serveur
│       │
│       ├── 📁 config/               # Configuration
│       │   └── database.ts          # Pool PostgreSQL
│       │
│       ├── 📁 database/             # Base de données
│       │   ├── schema.sql           # Schéma complet de la BDD
│       │   └── sample-data.sql      # Données d'exemple
│       │
│       ├── 📁 middleware/           # Middlewares
│       │   └── auth.ts              # Authentification JWT
│       │
│       ├── 📁 routes/               # Routes API
│       │   ├── auth.routes.ts       # Login/Register
│       │   ├── clients.routes.ts    # CRUD Clients
│       │   ├── interventions.routes.ts  # CRUD Interventions
│       │   ├── inventory.routes.ts  # CRUD Stock
│       │   ├── statistics.routes.ts # Statistiques
│       │   └── pdf.routes.ts        # Génération PDF
│       │
│       └── 📁 types/                # Types TypeScript
│           └── index.ts             # Interfaces & Types
│
└── 📁 frontend/                     # Application React
    ├── 📄 package.json              # Dépendances frontend
    ├── 📄 tsconfig.json             # Configuration TypeScript
    ├── 📄 tsconfig.node.json        # Configuration TS pour Vite
    ├── 📄 vite.config.ts            # Configuration Vite
    ├── 📄 tailwind.config.js        # Configuration Tailwind CSS
    ├── 📄 postcss.config.js         # Configuration PostCSS
    ├── 📄 .env.example              # Template variables d'environnement
    ├── 📄 index.html                # Point d'entrée HTML
    │
    └── 📁 src/                      # Code source frontend
        │
        ├── 📄 main.tsx              # Point d'entrée React
        ├── 📄 App.tsx               # Composant racine + Routes
        ├── 📄 index.css             # Styles globaux + Tailwind
        │
        ├── 📁 components/           # Composants réutilisables
        │   └── Layout.tsx           # Layout principal (header + sidebar)
        │
        ├── 📁 context/              # Context API
        │   └── AuthContext.tsx      # Gestion authentification
        │
        ├── 📁 pages/                # Pages de l'application
        │   ├── Login.tsx            # Page de connexion
        │   ├── Dashboard.tsx        # Tableau de bord
        │   ├── Interventions.tsx    # Liste interventions
        │   ├── InterventionForm.tsx # Formulaire intervention
        │   ├── Clients.tsx          # Liste clients
        │   ├── ClientForm.tsx       # Formulaire client
        │   ├── Inventory.tsx        # Gestion du stock
        │   └── Calendar.tsx         # Vue calendrier
        │
        ├── 📁 services/             # Services API
        │   └── api.ts               # Client Axios + endpoints
        │
        └── 📁 types/                # Types TypeScript
            └── index.ts             # Interfaces & Types
```

---

## Détails des fichiers principaux

### 📁 Backend

#### `server.ts` - Serveur Express
- Point d'entrée de l'API
- Configuration des middlewares
- Montage des routes
- Gestion des erreurs

#### Routes API
Chaque fichier gère un domaine :
- **auth.routes.ts** → `/api/auth/*` - Login, Register
- **clients.routes.ts** → `/api/clients/*` - CRUD clients
- **interventions.routes.ts** → `/api/interventions/*` - CRUD interventions
- **inventory.routes.ts** → `/api/inventory/*` - CRUD stock
- **statistics.routes.ts** → `/api/statistics/*` - Stats & analytics
- **pdf.routes.ts** → `/api/pdf/:id` - Génération rapports PDF

#### Base de données
- **schema.sql** - Création des tables, indexes, triggers
- **sample-data.sql** - Jeu de données de démonstration

### 📁 Frontend

#### Pages principales
- **Login.tsx** - Authentification avec formulaire moderne
- **Dashboard.tsx** - Statistiques, interventions urgentes, accès rapide
- **Interventions.tsx** - Liste filtrable avec téléchargement PDF
- **InterventionForm.tsx** - Création/édition avec calcul automatique
- **Clients.tsx** - Cartes clients avec recherche
- **ClientForm.tsx** - Formulaire client complet
- **Inventory.tsx** - Gestion stock avec alertes
- **Calendar.tsx** - Vue mensuelle avec détails par jour

#### Services
- **api.ts** - Configuration Axios, intercepteurs, endpoints API

#### Context
- **AuthContext.tsx** - État global d'authentification

---

## Technologies par dossier

### Backend (`/backend`)

**Dépendances principales :**
```json
{
  "express": "^4.18.2",        // Framework web
  "pg": "^8.11.3",              // Client PostgreSQL
  "bcrypt": "^5.1.1",           // Hashage mots de passe
  "jsonwebtoken": "^9.0.2",     // Tokens JWT
  "cors": "^2.8.5",             // CORS
  "dotenv": "^16.3.1",          // Variables d'environnement
  "pdfkit": "^0.14.0",          // Génération PDF
  "express-validator": "^7.0.1" // Validation
}
```

**Dev dependencies :**
```json
{
  "typescript": "^5.3.3",
  "ts-node": "^10.9.2",
  "nodemon": "^3.0.2",
  "@types/..." // Types TypeScript
}
```

### Frontend (`/frontend`)

**Dépendances principales :**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",  // Routing
  "axios": "^1.6.2",               // HTTP client
  "date-fns": "^3.0.6",            // Dates
  "@heroicons/react": "^2.1.1"     // Icônes
}
```

**Build tools :**
```json
{
  "vite": "^5.0.8",                 // Build rapide
  "@vitejs/plugin-react": "^4.2.1",
  "tailwindcss": "^3.3.6",          // CSS framework
  "typescript": "^5.3.3"
}
```

---

## Fichiers de configuration

### Backend

| Fichier | Description |
|---------|-------------|
| `tsconfig.json` | Configuration TypeScript (target, modules, paths) |
| `nodemon.json` | Watch files, auto-restart serveur |
| `.env` | Variables d'environnement (DB, JWT, etc.) |
| `package.json` | Scripts npm, dépendances |

### Frontend

| Fichier | Description |
|---------|-------------|
| `tsconfig.json` | Configuration TypeScript React |
| `tsconfig.node.json` | Configuration pour Vite |
| `vite.config.ts` | Build config, proxy API |
| `tailwind.config.js` | Thème, couleurs, extensions |
| `postcss.config.js` | Autoprefixer, Tailwind |
| `.env` | URL de l'API backend |
| `package.json` | Scripts npm, dépendances |
| `index.html` | Point d'entrée HTML |

---

## Scripts disponibles

### Backend

```bash
npm run dev          # Démarrage en mode développement (nodemon)
npm run build        # Compilation TypeScript → dist/
npm start            # Démarrage production (node dist/server.js)
npm run db:migrate   # Migration base de données
```

### Frontend

```bash
npm run dev          # Serveur de développement Vite (port 3000)
npm run build        # Build production → dist/
npm run preview      # Prévisualiser le build
```

---

## Environnements

### Développement

**Backend :**
- Port : 5000
- Database : localhost:5432
- Hot reload : ✅ (nodemon)
- Logs : Console

**Frontend :**
- Port : 3000
- Proxy : `/api` → `http://localhost:5000`
- Hot reload : ✅ (Vite HMR)
- React DevTools : ✅

### Production

**Backend :**
- Build TypeScript compilé
- Variables d'env sécurisées
- PM2 ou Docker recommandé
- Logs fichiers

**Frontend :**
- Build optimisé minifié
- Assets hashés
- Serveur statique (Nginx)
- CDN recommandé

---

## Taille approximative

```
backend/
  node_modules/    ~150 MB
  src/             ~50 KB
  dist/ (build)    ~200 KB

frontend/
  node_modules/    ~350 MB
  src/             ~100 KB
  dist/ (build)    ~500 KB

TOTAL (dev):       ~500 MB
TOTAL (prod):      ~700 KB
```

---

## Points d'entrée

### Backend
```
npm run dev
  ↓
nodemon
  ↓
ts-node src/server.ts
  ↓
Express écoute sur :5000
```

### Frontend
```
npm run dev
  ↓
Vite dev server
  ↓
index.html → src/main.tsx
  ↓
React render sur :3000
```

---

## Flux de données

```
User (Browser)
  ↓ HTTP Request
Frontend React (:3000)
  ↓ Axios + JWT
API Express (:5000)
  ↓ SQL Queries
PostgreSQL (:5432)
  ↓ Results
API Response (JSON)
  ↓
Frontend UI Update
```

---

## Conventions de nommage

### Backend
- Fichiers : `kebab-case.ts`
- Routes : `/api/resource`
- Fonctions : `camelCase`
- Types : `PascalCase`

### Frontend
- Composants : `PascalCase.tsx`
- Fichiers services : `camelCase.ts`
- CSS classes : Tailwind utilities
- Types : `PascalCase`

---

**Structure optimisée pour l'Entreprise GALAND Plomberie** 🔧
