# Fonctionnalités Détaillées - GALAND Plomberie

## Vue d'ensemble

Application web complète de gestion d'interventions pour entreprise de plomberie avec interface moderne et responsive.

---

## 🏠 Tableau de bord

### Statistiques en temps réel
- **Interventions du mois** - Compteur des interventions planifiées ce mois
- **Clients actifs** - Nombre de clients ayant eu une intervention dans les 6 derniers mois
- **Revenu mensuel** - Total des interventions facturées ce mois
- **Interventions urgentes** - Nombre d'interventions urgentes en attente

### Widgets
- **Liste des interventions urgentes** avec détails (client, type, date, heure)
- **Résumé global** avec :
  - Total interventions
  - Interventions terminées
  - Interventions en attente
  - Revenu total
  - Alertes stock

### Accès rapide
- Bouton "Nouvelle intervention"
- Bouton "Nouveau client"
- Bouton "Voir le calendrier"

---

## 🔧 Gestion des Interventions

### Liste des interventions

**Filtres disponibles :**
- Par statut (Planifiée, En cours, Terminée, Facturée)
- Urgentes uniquement
- Recherche par client ou type

**Affichage en tableau :**
- ID de l'intervention
- Nom et téléphone du client
- Date et heure
- Type d'intervention
- Statut avec badge coloré
- Montant total
- Badge "URGENT" si applicable

**Actions :**
- ✏️ Modifier l'intervention
- 📄 Télécharger le PDF du rapport

### Formulaire d'intervention

**Informations principales :**
- Sélection du client (liste déroulante)
- Type d'intervention (Fuite, Débouchage, Installation, Réparation, Entretien, Urgence, Autre)
- Date et heure
- Statut (Planifiée, En cours, Terminée, Facturée)
- Case à cocher "Intervention urgente"

**Description :**
- Description du problème (obligatoire)
- Travaux effectués
- Notes complémentaires

**Facturation :**
- Temps passé (en heures)
- Coût de la main d'œuvre (€)
- **Calcul automatique** : Main d'œuvre + Matériaux = Total

**Pièces utilisées :**
- Ajout dynamique de lignes
- Sélection depuis l'inventaire
- Quantité disponible affichée
- Prix unitaire pré-rempli
- **Déduction automatique du stock**
- Calcul automatique du total

### Génération de PDF

Le PDF généré contient :
- En-tête GALAND Plomberie avec coordonnées
- Numéro de rapport
- Informations client complètes
- Détails de l'intervention
- Description du problème
- Travaux effectués
- Tableau des pièces utilisées avec références et prix
- Récapitulatif financier détaillé
- Date et heure de génération

**Format professionnel** prêt à envoyer au client.

---

## 👥 Gestion des Clients

### Liste des clients

**Affichage en cartes :**
Chaque carte affiche :
- Nom complet du client
- Nombre d'interventions effectuées
- Téléphone
- Email (si renseigné)
- Adresse complète
- Boutons Modifier / Supprimer

**Recherche en temps réel :**
- Par nom
- Par email
- Par téléphone

### Formulaire client

**Champs disponibles :**
- Prénom et nom (obligatoires)
- Email
- Téléphone (obligatoire)
- Adresse (obligatoire)
- Code postal et ville
- Notes (informations complémentaires, préférences, codes d'accès, etc.)

**Validation :**
- Vérification des champs obligatoires
- Format email validé
- Sauvegarde sécurisée

---

## 📦 Gestion du Stock

### Liste de l'inventaire

**Affichage en tableau :**
- Nom de l'article
- Référence
- Catégorie
- Quantité en stock
- Stock minimum
- Prix unitaire
- Actions (Modifier / Supprimer)

**Alertes visuelles :**
- ⚠️ Ligne rouge si quantité ≤ stock minimum
- Icône d'alerte sur les articles en rupture

**Filtres :**
- Recherche par nom, référence ou catégorie
- Case "Stocks faibles uniquement"

### Formulaire d'article

**Modal moderne avec champs :**
- Nom de l'article (obligatoire)
- Référence produit
- Catégorie
- Quantité en stock (obligatoire)
- Stock minimum (alerte si dépassé)
- Prix unitaire HT
- Description

**Catégories suggérées :**
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

## 📅 Calendrier

### Vue mensuelle

**Affichage :**
- Grille calendaire du mois
- Navigation mois précédent / suivant
- Jour actuel mis en évidence

**Indicateurs visuels :**
- Points de couleur par intervention
- Code couleur selon le statut :
  - 🔵 Bleu = Planifiée
  - 🟡 Jaune = En cours
  - 🟢 Vert = Terminée
  - 🟣 Violet = Facturée
- Compteur si plus de 3 interventions par jour

### Panneau de détails

**À droite du calendrier :**
- Date sélectionnée
- Liste des interventions du jour
- Pour chaque intervention :
  - Nom du client
  - Type d'intervention
  - Heure (si renseignée)
  - Description courte
  - Badge statut
  - Badge URGENT si applicable
  - Lien vers les détails

---

## 🔐 Authentification

### Page de connexion

**Design moderne :**
- Formulaire centré sur fond dégradé bleu
- Logo et nom de l'entreprise
- Champs Email et Mot de passe
- Bouton de connexion
- Messages d'erreur clairs

**Sécurité :**
- Authentification JWT
- Tokens avec expiration (7 jours par défaut)
- Hashage bcrypt des mots de passe
- Protection des routes API

**Session :**
- Token stocké localement
- Auto-déconnexion si token expiré
- Bouton déconnexion dans le header

---

## 🎨 Interface Utilisateur

### Design

**Palette de couleurs :**
- Bleu primaire (#0284c7) pour l'interface
- Gris pour les textes et fonds
- Code couleur pour les statuts
- Rouge pour les urgences et alertes

**Composants :**
- Cards avec ombre portée
- Boutons avec effets hover
- Badges colorés pour les statuts
- Icônes Heroicons
- Formulaires responsive
- Tableaux avec hover

### Navigation

**Menu latéral :**
- Tableau de bord
- Interventions
- Clients
- Stock
- Calendrier

**Header :**
- Logo GALAND Plomberie
- Nom de l'utilisateur connecté
- Bouton déconnexion

### Responsive

✅ **Mobile friendly :**
- Grille adaptative
- Menu responsive
- Tableaux avec scroll horizontal
- Formulaires optimisés

---

## 📊 Statistiques

### Vue d'ensemble (API)

**Endpoints disponibles :**
- `/api/statistics` - Statistiques générales
- `/api/statistics/monthly-revenue` - Revenus par mois (12 derniers mois)
- `/api/statistics/interventions-by-type` - Répartition par type

**Données calculées :**
- Interventions totales et par période
- Taux de complétion
- Revenus totaux et mensuels
- Nombre de clients actifs
- Alertes stock

---

## 🔒 Sécurité

### Mesures implémentées

**Backend :**
- ✅ Authentification JWT
- ✅ Hashage bcrypt (10 rounds)
- ✅ Middleware d'authentification
- ✅ Validation des données (express-validator)
- ✅ Protection CORS
- ✅ Gestion des erreurs centralisée
- ✅ Variables d'environnement (.env)

**Frontend :**
- ✅ Routes protégées
- ✅ Redirection si non authentifié
- ✅ Token dans headers HTTP
- ✅ Gestion des erreurs 401/403
- ✅ Validation côté client

**Base de données :**
- ✅ Requêtes paramétrées (protection SQL injection)
- ✅ Indexes pour performance
- ✅ Triggers pour updated_at
- ✅ Contraintes d'intégrité référentielle
- ✅ CASCADE delete pour cohérence

---

## 🚀 Performance

### Optimisations

**Backend :**
- Pool de connexions PostgreSQL
- Indexes sur les colonnes fréquemment recherchées
- Requêtes optimisées avec JOINs
- Gestion des transactions pour cohérence

**Frontend :**
- Build optimisé avec Vite
- Lazy loading des routes
- État local optimisé
- Re-render minimisé

---

## 📱 Cas d'usage

### Scénario 1 : Intervention urgente

1. Client appelle pour fuite importante
2. Créer une nouvelle intervention
3. Cocher "Urgent"
4. Planifier date/heure
5. L'intervention apparaît en rouge sur le dashboard
6. Après intervention : ajouter travaux effectués et pièces
7. Générer et envoyer le PDF au client
8. Marquer comme "Facturée"

### Scénario 2 : Gestion du stock

1. Consulter l'inventaire
2. Voir les alertes (stock faible)
3. Ajouter de nouveaux articles
4. Lors d'une intervention, les pièces sont déduites automatiquement
5. Recevoir une alerte si stock < minimum

### Scénario 3 : Planification

1. Ouvrir le calendrier
2. Voir les interventions du mois
3. Identifier les créneaux libres
4. Planifier de nouvelles interventions
5. Éviter les conflits d'horaires

---

## 🛠️ API REST

Toutes les routes sont documentées dans le README principal.

**Format des réponses :**
- JSON pour toutes les réponses
- Codes HTTP standards (200, 201, 400, 401, 404, 500)
- Messages d'erreur clairs
- Données cohérentes

---

## 📈 Évolutions futures possibles

### Fonctionnalités supplémentaires

- 📧 Envoi automatique de PDF par email
- 📱 Application mobile (React Native)
- 💳 Paiement en ligne
- 📊 Graphiques de statistiques (revenus, types d'interventions)
- 🔔 Notifications push
- 📞 Intégration téléphonie
- 🗺️ Carte des interventions (Google Maps)
- 👥 Gestion multi-utilisateurs avec rôles
- 📝 Devis en ligne
- 🔄 Synchronisation hors ligne (PWA)

---

**Développé pour l'Entreprise GALAND Plomberie** 🔧
