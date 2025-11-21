# Guide de Démarrage Rapide - GALAND Plomberie

## 🚀 Démarrage en 3 commandes

```bash
# 1. Démarrer l'application avec Docker
docker-compose up -d

# 2. Vérifier que tout fonctionne
docker-compose ps

# 3. Accéder à l'application
# Frontend: http://localhost
# Backend API: http://localhost:5000
```

**Compte par défaut :**
- Email : `admin@galand-plomberie.fr`
- Mot de passe : `admin123`

## 📋 Prérequis

- Docker Engine >= 20.10
- Docker Compose >= 2.0
- 2 GB de RAM minimum
- 5 GB d'espace disque

## 🔧 Configuration initiale

### Option 1 : Utiliser les valeurs par défaut (développement)

Le fichier `.env` est déjà configuré avec des valeurs par défaut. Vous pouvez démarrer directement.

### Option 2 : Configuration personnalisée (production)

Modifiez le fichier `.env` :

```env
# Base de données PostgreSQL
POSTGRES_USER=galand
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
POSTGRES_DB=galand_plomberie

# JWT (minimum 32 caractères)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire_minimum_32_caracteres

# CORS (domaine de votre frontend)
CORS_ORIGIN=http://localhost
```

## 📦 Commandes principales

### Démarrer l'application

```bash
# Démarrer en arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

### Arrêter l'application

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les données (⚠️ Supprime la base de données)
docker-compose down -v
```

### Vérifier l'état

```bash
# Voir l'état des conteneurs
docker-compose ps

# Voir les logs d'un service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres-galand
```

### Redémarrer un service

```bash
# Redémarrer le backend
docker-compose restart backend

# Redémarrer tous les services
docker-compose restart
```

## 🗄️ Gestion de la base de données

### Sauvegarder

```bash
docker-compose exec postgres-galand pg_dump -U galand galand_plomberie > backup.sql
```

### Restaurer

```bash
docker-compose exec -T postgres-galand psql -U galand galand_plomberie < backup.sql
```

### Accéder à PostgreSQL

```bash
docker-compose exec postgres-galand psql -U galand -d galand_plomberie
```

## 🔍 Vérification de santé

Tous les services incluent des health checks :

```bash
docker-compose ps
```

Vous devriez voir "healthy" pour tous les services.

## 🛠️ Dépannage

### Le backend ne démarre pas

```bash
# Voir les logs
docker-compose logs backend

# Redémarrer le service
docker-compose restart backend
```

### Port déjà utilisé

Modifiez les ports dans `docker-compose.yml` :

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Changez 5001

  frontend:
    ports:
      - "8080:80"    # Changez 8080
```

### Erreur de base de données

```bash
# Réinitialiser complètement
docker-compose down -v
docker-compose up -d
```

## 📚 Documentation complète

- **Guide Docker détaillé** : Voir `DOCKER.md`
- **Documentation générale** : Voir `README.md`
- **Structure du projet** : Voir `PROJECT_STRUCTURE.md`

## ⚠️ Important pour la production

1. ✅ Changez le mot de passe PostgreSQL
2. ✅ Changez le JWT_SECRET (minimum 32 caractères)
3. ✅ Changez le mot de passe admin par défaut
4. ✅ Utilisez HTTPS avec certificat SSL
5. ✅ Configurez correctement CORS_ORIGIN
6. ✅ Activez les sauvegardes automatiques

## 🆘 Support

Pour toute question :
- Email : contact@galand-plomberie.fr
- Documentation complète : `DOCKER.md`
