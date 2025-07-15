# Configuration Supabase pour AnkiOccitan

## 🚀 Configuration initiale

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
VITE_REVIARDA_API_URL=https://revirada.example.com
VITE_REVIARDA_API_KEY=ma_cle_revirada
VITE_VOTZ_API_URL=https://votz.example.com
VITE_VOTZ_API_KEY=ma_cle_votz
```

### 3. Configuration de la base de données

1. Allez dans l'éditeur SQL de votre projet Supabase
2. Copiez et exécutez le contenu du fichier `supabase-setup.sql`
3. Ce script créera :
   - La table `decks` avec toutes les colonnes nécessaires
   - La table `cards` pour les cartes de révision
   - Les index pour optimiser les performances
   - Les triggers pour maintenir la cohérence des données
   - Les politiques RLS (Row Level Security) pour la sécurité

## 📊 Structure des tables

### Table `decks`

| Colonne         | Type         | Description                                                        |
| --------------- | ------------ | ------------------------------------------------------------------ |
| `id`            | UUID         | Identifiant unique (généré automatiquement)                        |
| `name`          | VARCHAR(255) | Nom du deck                                                        |
| `description`   | TEXT         | Description du deck                                                |
| `category`      | VARCHAR(50)  | Catégorie (grammar, conjugation, vocabulary, expressions, culture) |
| `tags`          | TEXT[]       | Tableau de tags                                                    |
| `is_public`     | BOOLEAN      | Visibilité du deck                                                 |
| `card_count`    | INTEGER      | Nombre de cartes (mis à jour automatiquement)                      |
| `created_at`    | TIMESTAMP    | Date de création                                                   |
| `updated_at`    | TIMESTAMP    | Date de dernière modification                                      |
| `user_id`       | UUID         | Référence vers l'utilisateur                                       |
| `last_studied`  | TIMESTAMP    | Dernière session d'étude                                           |
| `study_count`   | INTEGER      | Nombre de sessions d'étude                                         |
| `average_score` | DECIMAL(3,2) | Score moyen                                                        |

### Table `cards`

| Colonne         | Type      | Description                   |
| --------------- | --------- | ----------------------------- |
| `id`            | UUID      | Identifiant unique            |
| `deck_id`       | UUID      | Référence vers le deck        |
| `front`         | TEXT      | Question/face avant           |
| `back`          | TEXT      | Réponse/face arrière          |
| `notes`         | TEXT      | Notes optionnelles            |
| `created_at`    | TIMESTAMP | Date de création              |
| `updated_at`    | TIMESTAMP | Date de modification          |
| `difficulty`    | INTEGER   | Niveau de difficulté (1-5)    |
| `last_reviewed` | TIMESTAMP | Dernière révision             |
| `review_count`  | INTEGER   | Nombre de révisions           |
| `next_review`   | TIMESTAMP | Prochaine révision programmée |

## 🔒 Sécurité (RLS)

Le projet utilise Row Level Security (RLS) pour garantir que :

- Les utilisateurs ne peuvent voir que leurs propres decks
- Les utilisateurs ne peuvent modifier que leurs propres decks
- Les utilisateurs ne peuvent voir les cartes que de leurs propres decks

## 🔄 Fonctionnalités automatiques

### Triggers configurés

1. **Mise à jour automatique de `updated_at`** : Se met à jour à chaque modification
2. **Compteur de cartes automatique** : `card_count` se met à jour quand des cartes sont ajoutées/supprimées

### Index de performance

- `idx_decks_user_id` : Recherche rapide par utilisateur
- `idx_decks_category` : Filtrage par catégorie
- `idx_decks_created_at` : Tri par date de création
- `idx_cards_deck_id` : Recherche des cartes par deck
- `idx_cards_next_review` : Programmation des révisions

## 🧪 Test de la configuration

### 1. Vérifier la connexion

```typescript
import { supabase } from './src/core/lib/supabase';

// Test de connexion
const { data, error } = await supabase.from('decks').select('count');
console.log('Connexion Supabase:', error ? 'Erreur' : 'OK');
```

### 2. Tester l'authentification

```typescript
// Vérifier l'utilisateur connecté
const {
  data: { user },
} = await supabase.auth.getUser();
console.log('Utilisateur connecté:', user?.id);
```

### 3. Tester la création d'un deck

```typescript
import { createDeck } from './src/core/api/supabaseDecksApi';

const testDeck = await createDeck({
  name: 'Test Deck',
  description: 'Deck de test',
  category: 'vocabulary',
  tags: ['test'],
  is_public: false,
});
console.log('Deck créé:', testDeck.id);
```

## 🚨 Dépannage

### Erreur "Missing Supabase environment variables"

- Vérifiez que le fichier `.env.local` existe
- Vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définies

### Erreur "Utilisateur non connecté"

- Assurez-vous que l'authentification Supabase est configurée
- Vérifiez que l'utilisateur est connecté avant d'accéder aux decks

### Erreur "Impossible de créer le deck"

- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur est authentifié
- Vérifiez les logs dans la console Supabase

## 📈 Monitoring

### Logs Supabase

1. Allez dans votre dashboard Supabase
2. Section "Logs" pour voir les requêtes et erreurs
3. Section "Database" pour voir les données en temps réel

### Métriques importantes

- Nombre de decks créés par jour
- Nombre de cartes par deck
- Temps de réponse des requêtes
- Erreurs d'authentification

## 🔄 Migration des données

Si vous avez des données existantes, vous pouvez les migrer avec :

```sql
-- Exemple de migration depuis une autre source
INSERT INTO decks (name, description, category, tags, is_public, user_id)
SELECT
  name,
  description,
  category,
  ARRAY[tags],
  is_public,
  user_id
FROM old_decks_table;
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API JavaScript](https://supabase.com/docs/reference/javascript)
- [Types TypeScript](https://supabase.com/docs/reference/javascript/typescript-support)
