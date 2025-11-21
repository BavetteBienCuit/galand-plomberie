# Documentation Base de Données - GALAND Plomberie

## Architecture PostgreSQL

Base de données relationnelle avec 5 tables principales et relations bien définies.

---

## Tables

### 1. `users` - Utilisateurs

Stocke les comptes utilisateurs pour l'authentification.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique |
| `email` | VARCHAR(255) | UNIQUE NOT NULL | Email de connexion |
| `password_hash` | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `role` | VARCHAR(50) | DEFAULT 'plumber' | Rôle (admin, plumber) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Dernière modification |

**Indexes :**
- PRIMARY KEY sur `id`
- UNIQUE sur `email`

**Utilisateur par défaut :**
- Email: `admin@galand-plomberie.fr`
- Mot de passe: `admin123` (⚠️ à changer en production)

---

### 2. `clients` - Clients

Base de données des clients de l'entreprise.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom |
| `email` | VARCHAR(255) | | Email (optionnel) |
| `phone` | VARCHAR(20) | NOT NULL | Téléphone |
| `address` | TEXT | NOT NULL | Adresse complète |
| `city` | VARCHAR(100) | | Ville |
| `postal_code` | VARCHAR(10) | | Code postal |
| `notes` | TEXT | | Notes et informations complémentaires |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Dernière modification |

**Indexes :**
- PRIMARY KEY sur `id`
- INDEX sur `email`
- INDEX sur `phone`

**Relations :**
- Un client peut avoir plusieurs interventions (1:N)

---

### 3. `inventory` - Inventaire/Stock

Catalogue des pièces et matériaux disponibles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique |
| `name` | VARCHAR(255) | NOT NULL | Nom de l'article |
| `reference` | VARCHAR(100) | UNIQUE | Référence produit |
| `description` | TEXT | | Description détaillée |
| `quantity` | INTEGER | NOT NULL DEFAULT 0 | Quantité en stock |
| `min_quantity` | INTEGER | DEFAULT 5 | Stock minimum (alerte) |
| `unit_price` | DECIMAL(10,2) | | Prix unitaire HT |
| `category` | VARCHAR(100) | | Catégorie (Robinetterie, etc.) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Dernière modification |

**Indexes :**
- PRIMARY KEY sur `id`
- UNIQUE sur `reference`
- INDEX sur `reference`

**Catégories courantes :**
- Robinetterie
- Tuyauterie
- Évacuation
- Joints
- WC
- Douche
- Pièces détachées
- Raccords
- Consommables

---

### 4. `interventions` - Interventions

Rapports d'intervention détaillés.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique |
| `client_id` | INTEGER | FK → clients(id) | Client concerné |
| `assigned_to` | INTEGER | FK → users(id) NULL | Plombier assigné |
| `intervention_date` | DATE | NOT NULL | Date de l'intervention |
| `intervention_time` | TIME | | Heure de l'intervention |
| `type` | VARCHAR(100) | NOT NULL | Type (Fuite, Débouchage, etc.) |
| `status` | VARCHAR(50) | DEFAULT 'planned' | Statut actuel |
| `problem_description` | TEXT | NOT NULL | Description du problème |
| `work_done` | TEXT | | Travaux effectués |
| `time_spent` | DECIMAL(5,2) | | Temps passé (heures) |
| `labor_cost` | DECIMAL(10,2) | | Coût main d'œuvre (€) |
| `materials_cost` | DECIMAL(10,2) | | Coût matériaux (€) |
| `total_cost` | DECIMAL(10,2) | | Coût total (€) |
| `is_urgent` | BOOLEAN | DEFAULT false | Intervention urgente |
| `notes` | TEXT | | Notes complémentaires |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Dernière modification |

**Indexes :**
- PRIMARY KEY sur `id`
- INDEX sur `client_id`
- INDEX sur `assigned_to`
- INDEX sur `intervention_date`
- INDEX sur `status`

**Statuts possibles :**
- `planned` - Planifiée
- `in_progress` - En cours
- `completed` - Terminée
- `invoiced` - Facturée

**Types d'intervention :**
- Fuite
- Débouchage
- Installation
- Réparation
- Entretien
- Urgence
- Autre

**Relations :**
- Appartient à un client (N:1)
- Peut être assignée à un plombier (N:1)
- Peut utiliser plusieurs matériaux (N:N via intervention_materials)

---

### 5. `intervention_materials` - Pièces utilisées

Table de liaison entre interventions et inventaire (relation N:N).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identifiant unique |
| `intervention_id` | INTEGER | FK → interventions(id) | Intervention concernée |
| `inventory_id` | INTEGER | FK → inventory(id) | Article utilisé |
| `quantity` | INTEGER | NOT NULL | Quantité utilisée |
| `unit_price` | DECIMAL(10,2) | | Prix unitaire au moment de l'intervention |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date d'ajout |

**Comportements :**
- Lors de l'ajout : déduit la quantité du stock
- Lors de la modification : ajuste le stock en conséquence
- Lors de la suppression : recrédite le stock

**Indexes :**
- PRIMARY KEY sur `id`
- INDEX sur `intervention_id`
- INDEX sur `inventory_id`

---

## Relations

```
users (1) ──────< (N) interventions
   │
   └─ assigned_to

clients (1) ─────< (N) interventions
   │
   └─ client_id

interventions (N) ────< (N) inventory
   │                        │
   └─── intervention_materials ──┘
        (table de liaison)
```

---

## Triggers

### `update_updated_at_column()`

Fonction PostgreSQL appelée automatiquement avant chaque UPDATE pour mettre à jour la colonne `updated_at`.

**Appliqué sur :**
- `users`
- `clients`
- `inventory`
- `interventions`

**Code :**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## Règles de suppression

### CASCADE DELETE

**Si un client est supprimé :**
- ✅ Toutes ses interventions sont supprimées
- ✅ Les matériaux liés aux interventions sont supprimés
- ✅ Le stock est **recrédité** automatiquement

**Si un article d'inventaire est supprimé :**
- ✅ Les liens dans `intervention_materials` sont supprimés
- ⚠️ L'intervention reste mais sans matériaux

**Si un utilisateur est supprimé :**
- ✅ Les interventions assignées restent mais `assigned_to` devient NULL

---

## Intégrité des données

### Contraintes

**Unicité :**
- Email des utilisateurs
- Référence des articles (si renseignée)

**Clés étrangères :**
- `interventions.client_id` → `clients.id` (CASCADE)
- `interventions.assigned_to` → `users.id` (SET NULL)
- `intervention_materials.intervention_id` → `interventions.id` (CASCADE)
- `intervention_materials.inventory_id` → `inventory.id` (CASCADE)

**Valeurs par défaut :**
- `status` = 'planned'
- `is_urgent` = false
- `min_quantity` = 5
- Timestamps automatiques

---

## Requêtes courantes

### Statistiques du dashboard

```sql
-- Interventions ce mois
SELECT COUNT(*)
FROM interventions
WHERE EXTRACT(MONTH FROM intervention_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM intervention_date) = EXTRACT(YEAR FROM CURRENT_DATE);

-- Clients actifs (6 derniers mois)
SELECT COUNT(DISTINCT client_id)
FROM interventions
WHERE intervention_date >= CURRENT_DATE - INTERVAL '6 months';

-- Revenu total facturé
SELECT COALESCE(SUM(total_cost), 0)
FROM interventions
WHERE status = 'invoiced';

-- Articles en stock faible
SELECT COUNT(*)
FROM inventory
WHERE quantity <= min_quantity;
```

### Interventions avec détails client

```sql
SELECT
  i.*,
  c.first_name as client_first_name,
  c.last_name as client_last_name,
  c.phone as client_phone,
  u.first_name as plumber_first_name,
  u.last_name as plumber_last_name
FROM interventions i
JOIN clients c ON i.client_id = c.id
LEFT JOIN users u ON i.assigned_to = u.id
ORDER BY i.intervention_date DESC;
```

### Historique client

```sql
SELECT i.*, u.first_name, u.last_name
FROM interventions i
LEFT JOIN users u ON i.assigned_to = u.id
WHERE i.client_id = ?
ORDER BY i.intervention_date DESC;
```

---

## Maintenance

### Sauvegardes recommandées

```bash
# Backup complet
pg_dump -U postgres galand_plomberie > backup.sql

# Backup avec compression
pg_dump -U postgres galand_plomberie | gzip > backup.sql.gz

# Restauration
psql -U postgres galand_plomberie < backup.sql
```

### Optimisation

```sql
-- Analyser les performances
EXPLAIN ANALYZE SELECT ...;

-- Réindexer si nécessaire
REINDEX DATABASE galand_plomberie;

-- Nettoyer
VACUUM ANALYZE;
```

---

## Sécurité

### Bonnes pratiques

✅ **À faire :**
- Utiliser des requêtes paramétrées (protection SQL injection)
- Hasher les mots de passe avec bcrypt
- Limiter les permissions PostgreSQL
- Sauvegardes régulières automatisées
- Monitoring des logs

❌ **À éviter :**
- Concaténation SQL directe
- Mots de passe en clair
- Accès root non restreint
- Pas de sauvegarde

---

## Scripts utiles

### Initialisation complète

```bash
# 1. Créer la base
createdb -U postgres galand_plomberie

# 2. Appliquer le schéma
psql -U postgres -d galand_plomberie -f backend/src/database/schema.sql

# 3. Charger les données d'exemple (optionnel)
psql -U postgres -d galand_plomberie -f backend/src/database/sample-data.sql
```

### Réinitialisation

```bash
# Supprimer et recréer
dropdb -U postgres galand_plomberie
createdb -U postgres galand_plomberie
psql -U postgres -d galand_plomberie -f backend/src/database/schema.sql
```

---

**Base de données conçue pour l'Entreprise GALAND Plomberie** 🔧
