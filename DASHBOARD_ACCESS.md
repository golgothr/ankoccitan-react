# Accès au Dashboard Ankòccitan

## Comment accéder au dashboard depuis la homepage

### Pour les utilisateurs connectés

1. **Via le header** : 
   - Un bouton "Dashboard" apparaît dans le header de la homepage
   - Cliquez dessus pour accéder directement au dashboard

2. **Via la section hero** :
   - Le bouton principal change de "Commencer maintenant" à "Accéder au Dashboard"
   - Cliquez dessus pour accéder au dashboard

3. **Via l'URL directe** :
   - Naviguez vers `/dashboard` dans votre navigateur

### Pour les utilisateurs non connectés

1. **Via le header** :
   - Cliquez sur "Créer un compte" pour vous inscrire
   - Ou cliquez sur "Connexion" si vous avez déjà un compte

2. **Via la section hero** :
   - Cliquez sur "Commencer maintenant" pour créer un compte

3. **Redirection automatique** :
   - Si vous essayez d'accéder à `/dashboard` sans être connecté, vous serez automatiquement redirigé vers la page de connexion
   - Après connexion, vous serez redirigé vers le dashboard

## Fonctionnalités du dashboard

Le dashboard comprend :

- **Header** : Logo, barre de recherche, avatar utilisateur, menu déroulant
- **Sidebar** : Navigation verticale avec icônes dégradées
- **Zone principale** : Statistiques, activité récente, accès rapides
- **Footer** : Liens vers documentation, support, contact

## Test de l'authentification

Pour tester rapidement l'accès au dashboard :

1. Ouvrez la console de votre navigateur (F12)
2. Copiez et collez le contenu du fichier `test-auth.js`
3. Appuyez sur Entrée
4. Naviguez vers `/dashboard` ou cliquez sur le bouton "Dashboard" dans le header

## Architecture technique

- **Hook centralisé** : `useAuth` gère l'état d'authentification
- **Protection des routes** : `ProtectedRoute` redirige automatiquement les utilisateurs non connectés
- **Persistance** : Les données d'authentification sont stockées dans le localStorage
- **Réactivité** : L'interface s'adapte automatiquement selon l'état de connexion

## Navigation

- **Homepage** (`/`) : Page d'accueil avec présentation du projet
- **Authentification** (`/auth`) : Connexion et inscription
- **Dashboard** (`/dashboard`) : Interface principale (protégée)
- **Profil** (`/profile`) : Gestion du profil utilisateur (protégée)
- **Conditions d'utilisation** (`/terms`) : Conditions légales
- **Politique de confidentialité** (`/privacy`) : Politique de confidentialité 