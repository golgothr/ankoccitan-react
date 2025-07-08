# AnkOccitan React - Projet Modulaire et Scalable

## 🎯 Objectif

Base de projet React TypeScript pour une **webapp collaborative et évolutive**, avec une **architecture modulaire feature-first** et une structure claire, facilement maintenable.

## 🏗️ Architecture

### Structure du projet
```
src/
├── assets/                 # Ressources statiques
├── components/            # Composants partagés
├── core/                  # Éléments transversaux
│   ├── api/              # Client API et services
│   ├── contexts/         # Contextes React
│   ├── hooks/            # Hooks personnalisés
│   ├── test/             # Configuration des tests
│   └── utils/            # Utilitaires
├── features/             # Domaines fonctionnels
│   ├── auth/             # Authentification
│   ├── decks/            # Gestion des decks
│   └── users/            # Gestion des utilisateurs
├── layouts/              # Layouts applicatifs
├── router.tsx            # Configuration du routeur
├── App.tsx               # Composant racine
└── main.tsx              # Point d'entrée
```

## 🛠️ Stack Technique

### Core
- **React 18.3.1** (version stable)
- **TypeScript 5.8.3**
- **Vite 6.3.5** (build tool)

### UI & Styling
- **Tailwind CSS 4.1.11**
- **PostCSS 8.5.6**

### Routing & State Management
- **React Router 6** (routing)
- **Zustand 5.0.6** (state management)
- **TanStack React Query 5.81.5** (server state)

### API & HTTP
- **Axios 1.10.0** (client HTTP)

### Testing
- **Vitest 3.2.4** (unit & integration tests)
- **React Testing Library 16.3.0**
- **Cypress 14.5.1** (E2E tests)
- **Storybook 8.6.14** (component documentation)

### Code Quality
- **ESLint 9.30.1** (linting)
- **Prettier 3.6.2** (formatting)
- **TypeScript ESLint 8.34.1**

### Git Hooks & CI
- **Husky 9.1.7** (git hooks)
- **Lint-staged 16.1.2** (pre-commit hooks)
- **Commitizen 4.3.1** (conventional commits)
- **Commitlint 19.8.1** (commit validation)

## 🚀 Scripts Disponibles

### Développement
```bash
npm run dev              # Démarrer le serveur de développement
npm run preview          # Prévisualiser le build de production
```

### Build & Production
```bash
npm run build            # Build de production
npm run build:analyze    # Build avec analyse du bundle
```

### Tests
```bash
npm run test             # Tests unitaires et d'intégration
npm run test:ui          # Interface de tests
npm run test:coverage    # Tests avec couverture
npm run test:e2e         # Tests E2E Cypress
npm run test:e2e:open    # Ouvrir Cypress
```

### Qualité de Code
```bash
npm run lint             # Linter le code
npm run lint:fix         # Corriger automatiquement
npm run format           # Formatter le code
npm run format:check     # Vérifier le formatage
npm run type-check       # Vérification TypeScript
```

### Sécurité & Maintenance
```bash
npm run security:audit   # Audit de sécurité
npm run security:fix     # Corriger les vulnérabilités
npm run deps:check       # Vérifier les dépendances obsolètes
npm run deps:update      # Mettre à jour les dépendances
```

### Utilitaires
```bash
npm run clean            # Nettoyer les fichiers générés
npm run clean:install    # Nettoyer et réinstaller
npm run ci:full          # Pipeline CI complet
npm run commit           # Commit conventionnel
```

## 🔒 Sécurité & Optimisations

### Verrouillage des Versions
- **Versions exactes** dans `package.json` (pas de `^` ou `~`)
- **npm-shrinkwrap.json** pour un lock rigide
- **Vérification automatique** des versions dans la CI

### Configuration Husky Sécurisée
```bash
# Permissions strictes sur les hooks
chmod 755 .husky/pre-commit
chmod 755 .husky/commit-msg
```

### Optimisations Vite
- **Code splitting** automatique
- **Tree shaking** agressif
- **Alias de chemins** pour les imports
- **Analyse du bundle** intégrée

## 🧪 Tests Avancés

### TestWrapper Personnalisé
```typescript
import { render } from '@core/test/TestWrapper';

render(<Component />, {
  wrapperProps: {
    withQueryClient: true,
    withRouter: true,
  },
});
```

### Tests d'Intégration
- **Mocks d'API** automatiques
- **Validation d'accessibilité**
- **Tests de performance**
- **Gestion des états de chargement**

### Configuration Cypress
- **Tests E2E** complets
- **Vidéos et screenshots** automatiques
- **Intégration CI/CD**

## 🔄 CI/CD Pipeline

### Workflow GitHub Actions
1. **🔒 Vérification Sécurité & Versions**
   - Audit des dépendances
   - Vérification Snyk
   - Contrôle des versions verrouillées

2. **🎯 Qualité de Code**
   - Linting ESLint
   - Formatage Prettier
   - Vérification TypeScript
   - Couverture de code

3. **🧪 Tests Multi-Environnements**
   - Tests unitaires (Node 18 & 20)
   - Tests d'intégration
   - Tests E2E Cypress

4. **🏗️ Build & Déploiement**
   - Build de production
   - Analyse du bundle
   - Déploiement conditionnel

## 📋 Conventions de Commit

### Format Conventionnel
```
type(scope): description

[optional body]

[optional footer]
```

### Types Supportés
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Exemples
```bash
feat(auth): ajouter la connexion OAuth
fix(api): corriger la gestion des erreurs 401
docs(readme): mettre à jour la documentation
```

## 🎨 Storybook

### Documentation des Composants
```bash
npm run storybook        # Démarrer Storybook
npm run build-storybook  # Build de Storybook
```

### Structure des Stories
- **Documentation** automatique
- **Contrôles interactifs**
- **Tests d'accessibilité**
- **Tests visuels**

## 🔧 Configuration

### Variables d'Environnement
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=AnkOccitan React
```

### Alias de Chemins
```typescript
import { Component } from '@components/Component';
import { useAuth } from '@features/auth/hooks/useAuth';
import { apiClient } from '@core/api/apiClient';
```

## 📊 Métriques & Monitoring

### Bundle Analysis
- **Analyse visuelle** du bundle
- **Tailles gzip/brotli**
- **Détection des doublons**
- **Optimisations recommandées**

### Couverture de Code
- **Rapports HTML** détaillés
- **Seuils de couverture**
- **Intégration CI/CD**

## 🚨 Points de Vigilance

### Versions
- **Maintenir React 18** (pas de React 19)
- **Vérifier la compatibilité** des dépendances
- **Mettre à jour régulièrement** les outils de sécurité

### Performance
- **Surveiller la taille** du bundle
- **Optimiser les imports** dynamiques
- **Utiliser la lazy loading** pour les routes

### Sécurité
- **Audit régulier** des dépendances
- **Vérifier les tokens** d'authentification
- **Valider les inputs** utilisateur

## 🤝 Contribution

### Workflow de Développement
1. **Fork** du repository
2. **Branch feature** (`feat/nom-feature`)
3. **Développement** avec tests
4. **Commit conventionnel**
5. **Pull Request** avec description
6. **Review** et merge

### Standards de Code
- **TypeScript strict**
- **ESLint + Prettier**
- **Tests obligatoires**
- **Documentation** des composants

## 📚 Ressources

### Documentation
- [React 18](https://react.dev/)
- [React Router 6](https://reactrouter.com/en/main)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query)
- [Vite](https://vitejs.dev/)

### Outils
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Cypress](https://cypress.io/)
- [Storybook](https://storybook.js.org/)

---

**Projet maintenu avec ❤️ pour la communauté AnkOccitan**
