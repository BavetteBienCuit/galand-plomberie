# GALAND Plomberie - Guide Docker

Ce guide explique comment déployer l'application GALAND Plomberie avec Docker.

## Prérequis

- Docker Engine >= 20.10
- Docker Compose >= 2.0
- 2 GB de RAM minimum
- 5 GB d'espace disque disponible

## Architecture Docker

L'application est composée de 3 conteneurs principaux :

1. **postgres-galand** : Base de données PostgreSQL 16
2. **backend** : API Node.js/Express (port 5000)
3. **frontend** : Application React avec Nginx (port 80)

## Démarrage rapide

### 1. Cloner le projet et configurer les variables d'environnement

```bash
cd galand-plomberie
```

Le fichier `.env` existe déjà avec des valeurs par défaut. Pour la production, modifiez :
- `POSTGRES_PASSWORD` : Mot de passe PostgreSQL
- `JWT_SECRET` : Clé secrète JWT (minimum 32 caractères)

### 2. Démarrer tous les services

```bash
docker-compose up -d
```

Cette commande va :
- Télécharger les images nécessaires
- Construire le backend et le frontend
- Créer et initialiser la base de données
- Démarrer tous les conteneurs

### 3. Vérifier l'état des conteneurs

```bash
docker-compose ps
```

Tous les conteneurs doivent être "healthy" ou "Up".

### 4. Accéder à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:5000
- **Documentation API** : http://localhost:5000

**Compte par défaut :**
- Email : `admin@galand-plomberie.fr`
- Mot de passe : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## Commandes Docker utiles

### Démarrer les services

```bash
# Démarrer en arrière-plan
docker-compose up -d

# Démarrer et voir les logs
docker-compose up

# Démarrer un service spécifique
docker-compose up -d backend
```

### Arrêter les services

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime la base de données)
docker-compose down -v

# Arrêter un service spécifique
docker-compose stop backend
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres-galand

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

### Reconstruire les images

```bash
# Reconstruire tout
docker-compose build

# Reconstruire un service spécifique
docker-compose build backend

# Reconstruire sans cache
docker-compose build --no-cache
```

### Redémarrer les services

```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
```

### Accéder à un conteneur

```bash
# Shell dans le backend
docker-compose exec backend sh

# Shell dans PostgreSQL
docker-compose exec postgres-galand psql -U galand -d galand_plomberie

# Shell dans le frontend (nginx)
docker-compose exec frontend sh
```

## Gestion de la base de données

### Sauvegarder la base de données

```bash
docker-compose exec postgres-galand pg_dump -U galand galand_plomberie > backup.sql
```

### Restaurer la base de données

```bash
docker-compose exec -T postgres-galand psql -U galand galand_plomberie < backup.sql
```

### Accéder à PostgreSQL

```bash
docker-compose exec postgres-galand psql -U galand -d galand_plomberie
```

### Réinitialiser la base de données

```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer (créera une nouvelle base)
docker-compose up -d
```

## Services optionnels (N8N, Ollama, Qdrant)

Le docker-compose inclut des services optionnels pour l'automatisation et l'IA.

### Activer N8N (automatisation)

```bash
docker-compose --profile n8n up -d
```

Accès : http://localhost:5680

### Activer Ollama (IA) - CPU

```bash
docker-compose --profile ai-cpu up -d
```

### Activer Ollama (IA) - GPU Nvidia

```bash
docker-compose --profile ai-gpu up -d
```

### Activer Qdrant (base de données vectorielle)

```bash
docker-compose --profile ai up -d
```

## Configuration avancée

### Variables d'environnement

Toutes les variables sont dans le fichier `.env` :

```env
# Base de données
POSTGRES_USER=galand
POSTGRES_PASSWORD=galand123
POSTGRES_DB=galand_plomberie

# JWT
JWT_SECRET=votre_cle_secrete_tres_longue
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Changer les ports

Modifiez le `docker-compose.yml` :

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Changer 5001 (port hôte)

  frontend:
    ports:
      - "8080:80"    # Changer 8080 (port hôte)
```

### Utiliser un domaine personnalisé

1. Modifiez `CORS_ORIGIN` dans `.env` :
```env
CORS_ORIGIN=https://votre-domaine.com
```

2. Configurez un reverse proxy (Nginx, Traefik, Caddy)

3. Ajoutez un certificat SSL (Let's Encrypt)

## Health Checks

L'application inclut des health checks pour tous les services :

- **Backend** : `GET /api/health` (toutes les 30s)
- **Frontend** : Test HTTP sur `/` (toutes les 30s)
- **PostgreSQL** : `pg_isready` (toutes les 10s)

Vérifier la santé :
```bash
docker-compose ps
```

## Monitoring et Logs

### Suivre les logs en temps réel

```bash
docker-compose logs -f
```

### Inspecter un conteneur

```bash
docker inspect galand-backend
docker inspect galand-postgres
```

### Statistiques des ressources

```bash
docker stats
```

## Dépannage

### Le backend ne démarre pas

1. Vérifier les logs :
```bash
docker-compose logs backend
```

2. Vérifier la connexion à la base de données :
```bash
docker-compose exec backend env | grep DB_
```

3. Vérifier que PostgreSQL est prêt :
```bash
docker-compose exec postgres-galand pg_isready
```

### Le frontend ne charge pas

1. Vérifier les logs Nginx :
```bash
docker-compose logs frontend
```

2. Vérifier que le backend est accessible :
```bash
curl http://localhost:5000/api/health
```

### La base de données ne démarre pas

1. Vérifier les logs :
```bash
docker-compose logs postgres-galand
```

2. Vérifier les permissions du volume :
```bash
docker volume inspect galand-plomberie_postgres_galand
```

3. Supprimer le volume et recommencer :
```bash
docker-compose down -v
docker-compose up -d
```

### Erreur de build

```bash
# Reconstruire sans cache
docker-compose build --no-cache

# Nettoyer tout Docker
docker system prune -a
docker volume prune
```

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port
sudo lsof -i :5000
sudo lsof -i :80

# Tuer le processus
sudo kill -9 <PID>
```

## Mise à jour

Pour mettre à jour l'application :

```bash
# 1. Sauvegarder la base de données
docker-compose exec postgres-galand pg_dump -U galand galand_plomberie > backup.sql

# 2. Arrêter les services
docker-compose down

# 3. Récupérer les dernières modifications
git pull

# 4. Reconstruire et redémarrer
docker-compose build
docker-compose up -d
```

## Production

### Checklist de sécurité

- [ ] Changer le mot de passe PostgreSQL
- [ ] Changer le JWT_SECRET (minimum 32 caractères)
- [ ] Changer le mot de passe admin par défaut
- [ ] Utiliser HTTPS avec certificat SSL
- [ ] Configurer les CORS correctement
- [ ] Activer les logs de production
- [ ] Configurer les sauvegardes automatiques
- [ ] Limiter l'accès aux ports (firewall)
- [ ] Utiliser Docker secrets au lieu de .env

### Déploiement avec HTTPS

Exemple avec Traefik :

```yaml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=admin@galand-plomberie.fr"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`galand-plomberie.fr`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```

## Support

Pour toute question :
- Documentation : Voir README.md
- Issues : Créer une issue sur le dépôt Git
- Email : contact@galand-plomberie.fr
