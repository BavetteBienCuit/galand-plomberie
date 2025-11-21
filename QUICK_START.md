# Guide de Démarrage Rapide - GALAND Plomberie

## Installation en 5 minutes

### 1. Installer PostgreSQL

**Windows :** Téléchargez et installez depuis [postgresql.org](https://www.postgresql.org/download/windows/)

Pendant l'installation :
- Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
- Port par défaut : 5432

### 2. Créer la base de données

Ouvrez **pgAdmin** ou **SQL Shell (psql)** :

```sql
CREATE DATABASE galand_plomberie;
```

Puis exécutez le schéma :
```bash
cd backend
psql -U postgres -d galand_plomberie -f src/database/schema.sql
```

### 3. Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd frontend
npm install
```

### 4. Configurer l'environnement

Créez `backend/.env` :
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=galand_plomberie
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_ICI

JWT_SECRET=ma_cle_secrete_super_longue_et_aleatoire_123456789
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

⚠️ **Important** : Remplacez `VOTRE_MOT_DE_PASSE_ICI` par le mot de passe PostgreSQL que vous avez défini.

### 5. Lancer l'application

**Option A - Utiliser le script (Windows) :**
```bash
start.bat
```

**Option B - Lancer manuellement :**

Terminal 1 :
```bash
cd backend
npm run dev
```

Terminal 2 :
```bash
cd frontend
npm run dev
```

### 6. Connexion

Ouvrez http://localhost:3000

**Identifiants par défaut :**
- Email : `admin@galand-plomberie.fr`
- Mot de passe : `admin123`

## Problèmes courants

### ❌ Erreur de connexion à la base de données

**Solution :** Vérifiez que :
1. PostgreSQL est bien démarré
2. Le mot de passe dans `.env` est correct
3. La base de données `galand_plomberie` existe

### ❌ Port 5000 ou 3000 déjà utilisé

**Solution :** Changez les ports dans les fichiers de configuration :
- Backend : `backend/.env` → `PORT=5001`
- Frontend : `frontend/vite.config.ts` → `port: 3001`

### ❌ Erreur "Cannot find module"

**Solution :**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### ❌ Erreur CORS

**Solution :** Vérifiez que `CORS_ORIGIN` dans `backend/.env` correspond à l'URL du frontend (par défaut `http://localhost:3000`)

## Prochaines étapes

1. ✅ Changez le mot de passe admin
2. ✅ Ajoutez vos premiers clients
3. ✅ Créez des articles dans l'inventaire
4. ✅ Planifiez vos interventions
5. ✅ Explorez le calendrier et les statistiques

## Besoin d'aide ?

Consultez le fichier [README.md](README.md) pour plus de détails.

Bon travail ! 🚀
