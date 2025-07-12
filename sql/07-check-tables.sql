-- =====================================================
-- VÉRIFICATION DES TABLES ET COLONNES
-- =====================================================

-- 1. Lister toutes les tables du schéma public
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Vérifier les colonnes de chaque table
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN (
    'users', 'decks', 'cards', 'import_jobs', 'import_logs', 
    'import_templates', 'deck_comments', 'deck_downloads', 
    'deck_favorites', 'deck_shares', 'user_api_keys', 
    'user_preferences', 'user_profile_extended', 'user_activity_logs', 
    'api_usage_stats'
  )
ORDER BY table_name, ordinal_position;

-- 3. Vérifier les politiques RLS existantes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 4. Vérifier les index existants
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname; 