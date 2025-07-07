module.exports = {
  types: [
    {
      value: 'feat',
      name: '✨ feat:     Nouvelle fonctionnalité',
      emoji: '✨',
    },
    {
      value: 'fix',
      name: '🐛 fix:      Correction de bug',
      emoji: '🐛',
    },
    {
      value: 'docs',
      name: '📚 docs:     Documentation',
      emoji: '📚',
    },
    {
      value: 'style',
      name: '💄 style:    Formatage, point-virgules manquants, etc.',
      emoji: '💄',
    },
    {
      value: 'refactor',
      name: '♻️  refactor: Refactoring du code',
      emoji: '♻️',
    },
    {
      value: 'perf',
      name: '⚡ perf:     Amélioration des performances',
      emoji: '⚡',
    },
    {
      value: 'test',
      name: '🧪 test:     Ajout ou modification de tests',
      emoji: '🧪',
    },
    {
      value: 'build',
      name: '🔨 build:    Modifications du système de build',
      emoji: '🔨',
    },
    {
      value: 'ci',
      name: '👷 ci:       Modifications de la CI/CD',
      emoji: '👷',
    },
    {
      value: 'chore',
      name: '🔧 chore:    Maintenance, dépendances, etc.',
      emoji: '🔧',
    },
    {
      value: 'revert',
      name: '⏪ revert:   Annulation d\'un commit précédent',
      emoji: '⏪',
    },
    {
      value: 'security',
      name: '🔒 security: Corrections de sécurité',
      emoji: '🔒',
    },
    {
      value: 'deps',
      name: '📦 deps:     Mise à jour des dépendances',
      emoji: '📦',
    },
  ],

  scopes: [
    { name: 'auth', description: 'Authentification et autorisation' },
    { name: 'api', description: 'API et services backend' },
    { name: 'ui', description: 'Interface utilisateur et composants' },
    { name: 'router', description: 'Routing et navigation' },
    { name: 'store', description: 'Gestion d\'état (Zustand)' },
    { name: 'query', description: 'React Query et cache' },
    { name: 'test', description: 'Tests et configuration' },
    { name: 'ci', description: 'CI/CD et déploiement' },
    { name: 'docs', description: 'Documentation' },
    { name: 'config', description: 'Configuration et outils' },
    { name: 'deps', description: 'Dépendances' },
    { name: 'security', description: 'Sécurité' },
    { name: 'perf', description: 'Performance' },
    { name: 'accessibility', description: 'Accessibilité' },
    { name: 'i18n', description: 'Internationalisation' },
    { name: 'mobile', description: 'Version mobile' },
    { name: 'desktop', description: 'Version desktop' },
    { name: 'core', description: 'Fonctionnalités core' },
    { name: 'features', description: 'Fonctionnalités métier' },
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf', 'security'],
  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // Override the messages, defaults are as follows
  messages: {
    type: "Sélectionnez le type de changement que vous committez:",
    scope: "Sélectionnez le scope de ce changement (optionnel):",
    customScope: "Indiquez le scope personnalisé:",
    subject: "Écrivez une description courte et concise du changement:\n",
    body: 'Fournissez une description plus détaillée du changement (optionnel). Utilisez "|" pour passer à la ligne:\n',
    breaking: 'Listez les changements BREAKING (optionnel):\n',
    footer: 'Issues fermées par ce changement (optionnel). Ex: #123, #245:\n',
    confirmCommit: 'Êtes-vous sûr de vouloir procéder avec le commit ci-dessus?',
  },

  skipQuestions: ['body', 'footer'],

  subjectLimit: 100,
  subjectSeparator: ': ',
  subjectPattern: '^[A-Za-z0-9\\s\\-\\.]+$',
  subjectPatternErrorMsg: 'Le sujet doit être en minuscules et ne peut contenir que des lettres, chiffres, espaces, tirets et points',

  // Limit subject length
  subjectLimit: 100,

  // Breaking change prefix
  breakingPrefix: 'BREAKING CHANGE: ',

  // Footer prefix
  footerPrefix: 'ISSUES CLOSED: ',

  // Ask for breaking change
  askForBreakingChangeFirst: true,

  // Custom rules
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'security', 'deps']],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
}; 