# Système d'Inscription - GALAND Plomberie

## ✅ Inscription Maintenant Disponible !

Le système d'inscription a été activé. Les nouveaux utilisateurs peuvent maintenant créer leur propre compte sans intervention de l'administrateur.

---

## 🎯 Accès à l'Inscription

### Pour les Nouveaux Utilisateurs

1. **Accéder à la page d'inscription**
   - URL directe : `http://localhost:3000/register`
   - Ou depuis la page de connexion : cliquer sur le lien **"S'inscrire"**

2. **Remplir le formulaire**
   - Prénom *
   - Nom *
   - Email * (doit être unique)
   - Mot de passe * (minimum 6 caractères)
   - Confirmation du mot de passe *

3. **Validation**
   - Compte créé automatiquement
   - Connexion automatique après inscription
   - Redirection vers le tableau de bord

---

## 📋 Caractéristiques du Système

### ✅ Validations Implémentées

**Côté Frontend :**
- Email au format valide
- Mot de passe minimum 6 caractères
- Confirmation de mot de passe identique
- Tous les champs obligatoires remplis

**Côté Backend :**
- Email unique (pas de doublon)
- Hashage sécurisé du mot de passe (bcrypt, 10 rounds)
- Génération automatique du JWT
- Création avec rôle par défaut : `plumber`

### 🔒 Sécurité

- ✅ **Mots de passe hashés** avec bcrypt (jamais stockés en clair)
- ✅ **JWT automatique** après inscription
- ✅ **Validation email unique** (pas de comptes multiples)
- ✅ **Protection CSRF** via tokens
- ✅ **Validation des données** côté serveur

### 👤 Rôles Utilisateur

Par défaut, tous les nouveaux inscrits ont le rôle `plumber`.

**Rôles disponibles :**
- `admin` - Accès complet (géré manuellement en BDD)
- `plumber` - Accès standard (par défaut)

Pour promouvoir un utilisateur en admin, modifier directement en base :
```sql
UPDATE users SET role = 'admin' WHERE email = 'email@example.com';
```

---

## 🖼️ Pages Modifiées

### 1. Page de Connexion ([Login.tsx](frontend/src/pages/Login.tsx))

**Ajouts :**
- Lien vers la page d'inscription
- Message "Pas encore de compte ? S'inscrire"

**Avant :**
```
[Formulaire de connexion]
Compte test: admin@galand-plomberie.fr / admin123
```

**Après :**
```
[Formulaire de connexion]
Pas encore de compte ? S'inscrire
Compte test: admin@galand-plomberie.fr / admin123
```

### 2. Nouvelle Page d'Inscription ([Register.tsx](frontend/src/pages/Register.tsx))

**Contenu :**
- Formulaire complet (prénom, nom, email, mot de passe)
- Validation en temps réel
- Messages d'erreur clairs
- Lien retour vers la connexion
- Design cohérent avec le reste de l'application

### 3. Routes ([App.tsx](frontend/src/App.tsx))

**Nouvelle route ajoutée :**
```typescript
<Route path="/register" element={<Register />} />
```

**Routes accessibles sans authentification :**
- `/login` - Connexion
- `/register` - Inscription

**Routes protégées :**
- `/` - Dashboard
- `/interventions` - Gestion interventions
- `/clients` - Gestion clients
- `/inventory` - Gestion stock
- `/calendar` - Calendrier

---

## 🔧 API Backend

### Endpoint d'Inscription

**Route :** `POST /api/auth/register`

**Déjà implémenté** dans [auth.routes.ts](backend/src/routes/auth.routes.ts)

**Corps de la requête :**
```json
{
  "email": "nouveau@example.com",
  "password": "motdepasse123",
  "first_name": "Jean",
  "last_name": "Dupont",
  "role": "plumber"  // optionnel, défaut = plumber
}
```

**Réponse en cas de succès (201) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "nouveau@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "role": "plumber",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erreurs possibles :**
- `400` - Champs manquants
- `409` - Email déjà utilisé
- `500` - Erreur serveur

---

## 🧪 Test du Système d'Inscription

### Scénario de Test Complet

1. **Démarrer l'application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Tester l'inscription**
   - Aller sur `http://localhost:3000/login`
   - Cliquer sur "S'inscrire"
   - Remplir le formulaire :
     - Prénom : Test
     - Nom : User
     - Email : test@example.com
     - Mot de passe : test123
     - Confirmation : test123
   - Cliquer sur "S'inscrire"

3. **Vérification**
   - ✅ Redirection automatique vers le dashboard
   - ✅ Nom affiché dans le header : "Test User"
   - ✅ Accès complet aux fonctionnalités

4. **Vérifier en base de données**
   ```sql
   SELECT id, email, first_name, last_name, role, created_at
   FROM users
   WHERE email = 'test@example.com';
   ```

5. **Tester doublon email**
   - Se déconnecter
   - Retourner sur `/register`
   - Réutiliser `test@example.com`
   - ✅ Erreur : "Email already registered"

---

## 🎨 Design de la Page d'Inscription

### Caractéristiques Visuelles

- **Style cohérent** avec la page de connexion
- **Fond dégradé** bleu (identité GALAND)
- **Formulaire centré** avec ombre portée
- **Grid 2 colonnes** pour prénom/nom
- **Champs validés** en temps réel
- **Messages d'erreur** en rouge
- **Bouton primaire** bleu
- **Lien retour** vers connexion

### Responsive

- ✅ Mobile (< 768px) : 1 colonne
- ✅ Tablette (768px - 1024px) : 2 colonnes
- ✅ Desktop (> 1024px) : 2 colonnes

---

## 📊 Flux d'Inscription

```
Utilisateur
    ↓
Page /register
    ↓
Remplir formulaire
    ↓
Validation frontend
    ↓ (si OK)
POST /api/auth/register
    ↓
Backend valide
    ↓
Hash mot de passe (bcrypt)
    ↓
Créer utilisateur en BDD
    ↓
Générer JWT
    ↓
Retour token + user
    ↓
Frontend stocke token
    ↓
Redirection vers /
    ↓
Dashboard affiché
```

---

## ⚙️ Configuration Additionnelle

### Désactiver l'Inscription (Optionnel)

Si vous souhaitez désactiver l'inscription publique :

1. **Retirer la route frontend**
   ```typescript
   // Dans App.tsx, commenter :
   // <Route path="/register" element={<Register />} />
   ```

2. **Désactiver l'endpoint backend**
   ```typescript
   // Dans auth.routes.ts, commenter :
   // router.post('/register', ...)
   ```

3. **Ou ajouter une vérification**
   ```typescript
   // Vérifier une variable d'environnement
   if (process.env.REGISTRATION_ENABLED !== 'true') {
     return res.status(403).json({ error: 'Registration disabled' });
   }
   ```

### Limiter les Inscriptions

Pour accepter uniquement certains emails :

```typescript
// Dans auth.routes.ts
const allowedDomains = ['@galand-plomberie.fr', '@galand.com'];
const emailDomain = email.substring(email.indexOf('@'));

if (!allowedDomains.includes(emailDomain)) {
  return res.status(403).json({
    error: 'Seuls les emails de l\'entreprise sont autorisés'
  });
}
```

---

## 🔐 Bonnes Pratiques

### Pour les Administrateurs

1. **Vérifier régulièrement** les nouveaux comptes
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
   ```

2. **Supprimer les comptes suspects**
   ```sql
   DELETE FROM users WHERE id = XXX;
   ```

3. **Promouvoir un utilisateur admin**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'trusted@example.com';
   ```

### Pour les Utilisateurs

1. ✅ Utiliser un mot de passe fort (min. 8 caractères recommandé)
2. ✅ Email professionnel de préférence
3. ✅ Informations réelles (nom, prénom)
4. ✅ Ne jamais partager son mot de passe

---

## 📝 Notes

### Changements Apportés

| Fichier | Type | Description |
|---------|------|-------------|
| `frontend/src/pages/Register.tsx` | ✅ Nouveau | Page d'inscription complète |
| `frontend/src/pages/Login.tsx` | 🔄 Modifié | Ajout lien inscription |
| `frontend/src/App.tsx` | 🔄 Modifié | Route `/register` ajoutée |
| `backend/src/routes/auth.routes.ts` | ✅ Déjà OK | Endpoint `/register` existant |

### Aucune Modification Nécessaire

- ✅ Backend déjà prêt
- ✅ Base de données compatible
- ✅ AuthContext gère l'authentification
- ✅ Sécurité déjà en place

---

## 🚀 Conclusion

**L'inscription est maintenant active !**

Les utilisateurs peuvent créer leurs comptes de manière autonome et accéder immédiatement à l'application.

**Pour tester :**
1. Aller sur `http://localhost:3000/register`
2. Créer un compte
3. Profiter de l'application !

---

**Système d'inscription développé pour l'Entreprise GALAND Plomberie** 🔧
