-- Script de test pour les nouvelles fonctions sécurisées
-- À exécuter après avoir appliqué 06-fix-security-views.sql

-- 1. Récupérer un UUID d'utilisateur valide
SELECT id, name, username FROM public.users LIMIT 1;

-- 2. Tester get_deck_stats avec un vrai UUID (remplace 'user-uuid' par un vrai UUID)
-- Exemple avec un UUID d'utilisateur existant :
SELECT * FROM get_deck_stats('00000000-0000-0000-0000-000000000000');

-- 3. Tester get_popular_decks
SELECT * FROM get_popular_decks(5);

-- 4. Tester get_user_complete_profile (remplace 'user-uuid' par un vrai UUID)
SELECT * FROM get_user_complete_profile('00000000-0000-0000-0000-000000000000');

-- 5. Récupérer un UUID de deck valide pour tester les commentaires
SELECT id, title FROM public.decks LIMIT 1;

-- 6. Tester get_deck_comments_with_users (remplace 'deck-uuid' par un vrai UUID)
SELECT * FROM get_deck_comments_with_users('00000000-0000-0000-0000-000000000000');

-- 7. Vérifier que les vues problématiques ont bien été supprimées
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename IN (
  'deck_comments_with_users',
  'user_complete_profile', 
  'popular_decks',
  'active_api_keys_with_stats',
  'decks_with_card_count',
  'user_api_usage_summary',
  'import_logs_with_details',
  'cards_with_deck_info',
  'user_favorites',
  'import_jobs_with_stats',
  'public_decks_with_stats'
);

-- 8. Vérifier que les nouvelles fonctions existent
SELECT proname, proargtypes 
FROM pg_proc 
WHERE proname IN (
  'get_deck_comments_with_users',
  'get_user_complete_profile',
  'get_popular_decks',
  'get_deck_stats'
); 