# 🚀 Démarrage Rapide - GALAND Plomberie

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   - Vérifiez : `node --version`
   - Téléchargez : https://nodejs.org/

2. **PostgreSQL** (version 14 ou supérieure)
   - Vérifiez : `psql --version`
   - Téléchargez : https://www.postgresql.org/download/

## 📦 Installation

### 1. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE galand_plomberie;

# Quitter
\q

# Initialiser le schéma
psql -U postgres -d galand_plomberie -f backend/src/database/schema.sql

# (Optionnel) Charger les données de test
psql -U postgres -d galand_plomberie -f backend/src/database/sample-data.sql
```

### 2. Configurer les variables d'environnement

Le fichier `backend/.env` a été créé automatiquement. **Important** : Modifiez le mot de passe PostgreSQL :

```bash
# Éditez backend/.env et changez :
DB_PASSWORD=postgres  # Remplacez par votre mot de passe PostgreSQL
```

### 3. Lancer l'application

#### Sur Linux/Mac :
```bash
./start.sh
```

#### Sur Windows :
```cmd
start.bat
```

#### Manuellement (2 terminaux) :

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 🌐 Accès à l'application

Une fois démarré :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000

### Connexion par défaut

```
Email : admin@galand-plomberie.fr
Mot de passe : admin123
```

⚠️ **Changez ce mot de passe après votre première connexion !**

## 🛠️ Commandes Utiles

### Backend
```bash
cd backend
npm run dev      # Mode développement
npm run build    # Compiler TypeScript
npm start        # Démarrer en production
```

### Frontend
```bash
cd frontend
npm run dev      # Mode développement
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
```

## 🐛 Problèmes Courants

### ❌ Erreur de connexion à PostgreSQL

**Solution :**
1. Vérifiez que PostgreSQL est démarré : `sudo service postgresql status` (Linux) ou `pg_ctl status` (Windows)
2. Vérifiez le mot de passe dans `backend/.env`
3. Vérifiez que la base de données existe : `psql -U postgres -l | grep galand`

### ❌ Port déjà utilisé

Si le port 5000 ou 3000 est déjà utilisé :

**Backend :** Modifiez `PORT` dans `backend/.env`
**Frontend :** Modifiez `port` dans `frontend/vite.config.ts`

### ❌ Erreur "Module not found"

```bash
# Réinstallez les dépendances
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

## 📚 Documentation Complète

Pour plus d'informations, consultez :
- [README.md](README.md) - Documentation complète
- [FEATURES.md](FEATURES.md) - Liste des fonctionnalités
- [DATABASE.md](DATABASE.md) - Schéma de la base de données
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Structure du projet

## 🎯 Prochaines Étapes

1. ✅ Connectez-vous avec le compte admin
2. ✅ Changez le mot de passe admin (dans la section profil)
3. ✅ Ajoutez vos premiers clients
4. ✅ Créez des articles dans l'inventaire
5. ✅ Planifiez vos premières interventions
6. ✅ Explorez le calendrier et les statistiques

## 💡 Conseils

- Utilisez le **Dashboard** pour avoir une vue d'ensemble
- Le **Calendrier** permet de visualiser toutes vos interventions
- Les **Alertes de stock** vous préviennent quand il faut réapprovisionner
- Vous pouvez **générer des PDF** pour chaque intervention

---

**Bon travail avec GALAND Plomberie ! 🔧**
