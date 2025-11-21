# 📚 Index de Documentation - GALAND Plomberie

Bienvenue dans le système de gestion d'interventions pour l'Entreprise GALAND Plomberie !

---

## 🗂️ Documentation disponible

### 🚀 Pour commencer

1. **[QUICK_START.md](QUICK_START.md)** ⭐ **COMMENCEZ ICI**
   - Installation en 5 minutes
   - Configuration rapide
   - Premiers pas
   - Résolution des problèmes courants

2. **[README.md](README.md)** 📖 Documentation complète
   - Vue d'ensemble du projet
   - Installation détaillée
   - Configuration avancée
   - Déploiement en production
   - API endpoints

### 📋 Fonctionnalités

3. **[FEATURES.md](FEATURES.md)** ✨ Liste complète des fonctionnalités
   - Tableau de bord
   - Gestion des interventions
   - Gestion des clients
   - Gestion du stock
   - Calendrier
   - Génération de PDF
   - Interface utilisateur
   - Sécurité

### 🗄️ Base de données

4. **[DATABASE.md](DATABASE.md)** 💾 Documentation technique BDD
   - Architecture PostgreSQL
   - Schéma des tables
   - Relations et contraintes
   - Triggers et fonctions
   - Requêtes courantes
   - Maintenance et sauvegardes

### 🏗️ Architecture

5. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** 📁 Structure du projet
   - Arborescence complète
   - Organisation des dossiers

### 🔧 Corrections

6. **[CORRECTIONS.md](CORRECTIONS.md)** 🐛 Corrections apportées
   - Erreurs TypeScript corrigées
   - Bugs logiques résolus
   - Optimisations effectuées
   - Vérifications de qualité

### 👥 Inscription

7. **[INSCRIPTION.md](INSCRIPTION.md)** ✍️ Système d'inscription
   - Page d'inscription activée
   - Création de compte autonome
   - Validation et sécurité
   - Guide d'utilisation

---

## 🎯 Guides par cas d'usage

### Je veux installer l'application
👉 Allez à [QUICK_START.md](QUICK_START.md)

### Je veux comprendre toutes les fonctionnalités
👉 Allez à [FEATURES.md](FEATURES.md)

### Je veux modifier la base de données
👉 Allez à [DATABASE.md](DATABASE.md)

### Je veux comprendre l'architecture du code
👉 Allez à [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Je veux déployer en production
👉 Allez à [README.md](README.md) section "Déploiement"

### J'ai un problème
👉 Allez à [QUICK_START.md](QUICK_START.md) section "Problèmes courants"

### Je veux créer un compte
👉 Allez à [INSCRIPTION.md](INSCRIPTION.md)

---

## 📂 Fichiers importants du projet

### Configuration Backend

| Fichier | Description | Obligatoire |
|---------|-------------|-------------|
| `backend/.env` | Variables d'environnement | ✅ Oui |
| `backend/package.json` | Dépendances npm | ✅ Oui |
| `backend/tsconfig.json` | Config TypeScript | ✅ Oui |
| `backend/src/server.ts` | Point d'entrée serveur | ✅ Oui |

### Configuration Frontend

| Fichier | Description | Obligatoire |
|---------|-------------|-------------|
| `frontend/package.json` | Dépendances npm | ✅ Oui |
| `frontend/vite.config.ts` | Config Vite | ✅ Oui |
| `frontend/tailwind.config.js` | Config Tailwind | ✅ Oui |
| `frontend/src/App.tsx` | Routes de l'app | ✅ Oui |

### Base de données

| Fichier | Description | Obligatoire |
|---------|-------------|-------------|
| `backend/src/database/schema.sql` | Schéma complet | ✅ Oui |
| `backend/src/database/sample-data.sql` | Données d'exemple | ⚪ Optionnel |

---

## 🛠️ Commandes essentielles

### Installation complète

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos paramètres

# 2. Frontend
cd ../frontend
npm install

# 3. Base de données
createdb -U postgres galand_plomberie
psql -U postgres -d galand_plomberie -f backend/src/database/schema.sql
```

### Lancement

**Windows :**
```bash
# Double-cliquer sur start.bat
# OU
start.bat
```

**Linux/Mac :**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Accès
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Login** : admin@galand-plomberie.fr / admin123

---

## 📊 Statistiques du projet

### Backend
- **Langages** : TypeScript, SQL
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **Authentification** : JWT + bcrypt
- **Fichiers** : ~20 fichiers TypeScript
- **Routes API** : 6 modules

### Frontend
- **Langages** : TypeScript, TSX
- **Framework** : React 18
- **Styling** : Tailwind CSS
- **Build** : Vite
- **Pages** : 8 pages principales
- **Composants** : Layout + 8 pages

### Database
- **Tables** : 5 tables principales
- **Relations** : 4 clés étrangères
- **Indexes** : 8 indexes
- **Triggers** : 4 triggers auto-update

---

## 🎨 Captures d'écran

### Tableau de bord
- Statistiques en temps réel
- Interventions urgentes
- Résumé global
- Accès rapide

### Interventions
- Liste filtrable
- Formulaire complet
- Génération PDF
- Gestion des matériaux

### Clients
- Base de données complète
- Fiches détaillées
- Historique d'interventions
- Recherche avancée

### Stock
- Inventaire complet
- Alertes stocks faibles
- Catégories
- Prix et quantités

### Calendrier
- Vue mensuelle
- Code couleur par statut
- Détails par jour
- Planning visuel

---

## 🔐 Sécurité

### Protections implémentées
- ✅ Authentification JWT
- ✅ Hashage bcrypt (10 rounds)
- ✅ Requêtes SQL paramétrées
- ✅ Validation des données
- ✅ Protection CORS
- ✅ Routes protégées
- ✅ Variables d'environnement

### En production
- 🔒 Changer le mot de passe admin
- 🔒 HTTPS obligatoire
- 🔒 JWT_SECRET aléatoire fort
- 🔒 Sauvegardes automatiques
- 🔒 Monitoring des logs

---

## 📞 Support

### En cas de problème

1. **Consulter [QUICK_START.md](QUICK_START.md)** - Problèmes courants
2. **Consulter [README.md](README.md)** - Dépannage avancé
3. **Vérifier les logs** - Backend console & frontend console
4. **Vérifier la BDD** - PostgreSQL status

### Contact
- 📧 Email : contact@galand-plomberie.fr
- 📝 GitHub Issues : Créer une issue
- 📖 Documentation : Lire ce guide

---

## 🚀 Évolutions futures possibles

- 📧 Envoi automatique de PDF par email
- 📱 Application mobile React Native
- 💳 Paiement en ligne
- 📊 Graphiques de statistiques avancés
- 🔔 Notifications push
- 📞 Intégration téléphonie
- 🗺️ Géolocalisation des interventions
- 👥 Multi-utilisateurs avec rôles
- 📝 Devis en ligne
- 🔄 PWA avec mode hors ligne

---

## 📝 Historique des versions

### v1.0.0 - Version initiale (2024)
- ✅ Authentification complète
- ✅ Gestion interventions
- ✅ Gestion clients
- ✅ Gestion stock
- ✅ Calendrier
- ✅ Génération PDF
- ✅ Statistiques
- ✅ Interface responsive

---

## 📜 Licence

**MIT License** - Libre d'utilisation et de modification

---

## 🙏 Remerciements

Développé avec ❤️ pour l'**Entreprise GALAND Plomberie**

**Technologies utilisées :**
- React, TypeScript, Node.js, Express, PostgreSQL
- Tailwind CSS, Vite, Heroicons, PDFKit
- date-fns, axios, JWT, bcrypt

---

## ✅ Checklist d'installation

Suivez cette liste pour une installation sans accroc :

- [ ] PostgreSQL installé et démarré
- [ ] Node.js >= 18.x installé
- [ ] Base de données `galand_plomberie` créée
- [ ] Schéma SQL exécuté (`schema.sql`)
- [ ] Backend : `npm install` effectué
- [ ] Backend : `.env` créé et configuré
- [ ] Frontend : `npm install` effectué
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000)
- [ ] Connexion réussie avec admin/admin123
- [ ] Données d'exemple chargées (optionnel)
- [ ] Tests des fonctionnalités OK

---

**Bon développement ! 🚀**

*Pour toute question, consultez d'abord la documentation ci-dessus.*
