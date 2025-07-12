-- =====================================================
-- CORRECTIONS DE PERFORMANCE RLS - VERSION COMPLÈTE
-- =====================================================

-- 1. CORRECTION DES APPELS AUTH DANS LES POLITIQUES RLS
-- =====================================================

-- Table users
ALTER POLICY "Users can view own profile" ON public.users 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile" ON public.users 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can insert own profile" ON public.users 
WITH CHECK ((select auth.uid()) = id);

ALTER POLICY "Users can delete own profile" ON public.users 
USING ((select auth.uid()) = id);

-- Table decks
ALTER POLICY "Users can view own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can create own decks" ON public.decks 
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can delete own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

-- Table cards (optimisé avec EXISTS)
ALTER POLICY "Users can view cards from own decks" ON public.cards 
USING (
  EXISTS (
    SELECT 1 FROM public.decks 
    WHERE decks.id = cards.deck_id 
    AND (select auth.uid()) = decks.user_id
  )
);

ALTER POLICY "Users can create cards in own decks" ON public.cards 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.decks 
    WHERE decks.id = cards.deck_id 
    AND (select auth.uid()) = decks.user_id
  )
);

ALTER POLICY "Users can update cards in own decks" ON public.cards 
USING (
  EXISTS (
    SELECT 1 FROM public.decks 
    WHERE decks.id = cards.deck_id 
    AND (select auth.uid()) = decks.user_id
  )
);

ALTER POLICY "Users can delete cards in own decks" ON public.cards 
USING (
  EXISTS (
    SELECT 1 FROM public.decks 
    WHERE decks.id = cards.deck_id 
    AND (select auth.uid()) = decks.user_id
  )
);

-- Table import_jobs
ALTER POLICY "Users can view own import jobs" ON public.import_jobs 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can create own import jobs" ON public.import_jobs 
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own import jobs" ON public.import_jobs 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can delete own import jobs" ON public.import_jobs 
USING ((select auth.uid()) = user_id);

-- Table import_logs (basée sur import_job_id)
ALTER POLICY "Users can view own import logs" ON public.import_logs 
USING (
  import_job_id IN (
    SELECT id FROM public.import_jobs 
    WHERE (select auth.uid()) = user_id
  )
);

ALTER POLICY "Users can create own import logs" ON public.import_logs 
WITH CHECK (
  import_job_id IN (
    SELECT id FROM public.import_jobs 
    WHERE (select auth.uid()) = user_id
  )
);

ALTER POLICY "Users can update own import logs" ON public.import_logs 
USING (
  import_job_id IN (
    SELECT id FROM public.import_jobs 
    WHERE (select auth.uid()) = user_id
  )
);

ALTER POLICY "Users can delete own import logs" ON public.import_logs 
USING (
  import_job_id IN (
    SELECT id FROM public.import_jobs 
    WHERE (select auth.uid()) = user_id
  )
);

-- Table import_templates
ALTER POLICY "Users can view own templates" ON public.import_templates 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can create own templates" ON public.import_templates 
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own templates" ON public.import_templates 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can delete own templates" ON public.import_templates 
USING ((select auth.uid()) = user_id);

-- Table deck_comments
ALTER POLICY "Users can view own comments" ON public.deck_comments 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own comments" ON public.deck_comments 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can delete own comments" ON public.deck_comments 
USING ((select auth.uid()) = user_id);

-- Table deck_downloads
ALTER POLICY "Users can view own downloads" ON public.deck_downloads 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own downloads" ON public.deck_downloads 
USING ((select auth.uid()) = user_id);

-- Table deck_favorites
ALTER POLICY "Users can view own favorites" ON public.deck_favorites 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can remove own favorites" ON public.deck_favorites 
USING ((select auth.uid()) = user_id);

-- Table deck_shares
ALTER POLICY "Users can view own shares" ON public.deck_shares 
USING ((select auth.uid()) = shared_by);

ALTER POLICY "Users can view shares with them" ON public.deck_shares 
USING (shared_with = (select auth.uid()));

ALTER POLICY "Users can create shares for own decks" ON public.deck_shares 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.decks 
    WHERE decks.id = deck_shares.deck_id 
    AND (select auth.uid()) = decks.user_id
  )
);

ALTER POLICY "Users can update own shares" ON public.deck_shares 
USING ((select auth.uid()) = shared_by);

ALTER POLICY "Users can delete own shares" ON public.deck_shares 
USING ((select auth.uid()) = shared_by);

-- Table user_api_keys
ALTER POLICY "Users can manage own api keys" ON public.user_api_keys 
USING ((select auth.uid()) = user_id);

-- Table user_preferences
ALTER POLICY "Users can manage own preferences" ON public.user_preferences 
USING ((select auth.uid()) = user_id);

-- Table user_profile_extended
ALTER POLICY "Users can manage own profile" ON public.user_profile_extended 
USING ((select auth.uid()) = user_id);

-- Table user_activity_logs
ALTER POLICY "Users can view own activity logs" ON public.user_activity_logs 
USING ((select auth.uid()) = user_id);

-- Table api_usage_stats
ALTER POLICY "Users can view own api usage" ON public.api_usage_stats 
USING ((select auth.uid()) = user_id);

-- 2. CONSOLIDATION DES POLITIQUES MULTIPLES
-- =====================================================

-- Suppression des politiques redondantes pour les tables avec accès public
DROP POLICY IF EXISTS "Allow read for all" ON public.users;
DROP POLICY IF EXISTS "Users can view public decks" ON public.decks;
DROP POLICY IF EXISTS "Users can view cards from public decks" ON public.cards;
DROP POLICY IF EXISTS "Users can view public comments" ON public.deck_comments;
DROP POLICY IF EXISTS "Users can view public shares" ON public.deck_shares;
DROP POLICY IF EXISTS "Users can view public templates" ON public.import_templates;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profile_extended;

-- 3. CRÉATION DE POLITIQUES UNIFIÉES POUR L'ACCÈS PUBLIC
-- =====================================================

-- Politique unifiée pour les decks publics
CREATE POLICY "Users can view public decks" ON public.decks
FOR SELECT USING (is_public = true);

-- Politique unifiée pour les cartes des decks publics
CREATE POLICY "Users can view cards from public decks" ON public.cards
FOR SELECT USING (
  deck_id IN (
    SELECT id FROM public.decks 
    WHERE is_public = true
  )
);

-- Politique unifiée pour les commentaires publics
CREATE POLICY "Users can view public comments" ON public.deck_comments
FOR SELECT USING (
  deck_id IN (
    SELECT id FROM public.decks 
    WHERE is_public = true
  )
);

-- Politique unifiée pour les partages publics
CREATE POLICY "Users can view public shares" ON public.deck_shares
FOR SELECT USING (
  deck_id IN (
    SELECT id FROM public.decks 
    WHERE is_public = true
  )
);

-- Politique unifiée pour les templates publics
CREATE POLICY "Users can view public templates" ON public.import_templates
FOR SELECT USING (is_public = true);

-- Politique unifiée pour les profils publics
CREATE POLICY "Users can view public profiles" ON public.user_profile_extended
FOR SELECT USING (is_public_profile = true);

-- 4. INDEX POUR AMÉLIORER LES PERFORMANCES (déjà créés selon votre liste)
-- =====================================================

-- Les index nécessaires existent déjà selon votre liste :
-- - idx_cards_deck_id ON public.cards(deck_id)
-- - idx_deck_comments_deck_id ON public.deck_comments(deck_id)
-- - idx_deck_shares_deck_id ON public.deck_shares(deck_id)
-- - idx_deck_shares_shared_with ON public.deck_shares(shared_with)
-- - idx_deck_favorites_user_id ON public.deck_favorites(user_id)
-- - idx_deck_downloads_user_id ON public.deck_downloads(user_id)
-- - idx_decks_is_public ON public.decks(is_public)
-- - idx_import_templates_is_public ON public.import_templates(is_public)
-- - idx_user_profile_extended_is_public ON public.user_profile_extended(is_public_profile)
-- - idx_decks_user_id ON public.decks(user_id)
-- - idx_import_jobs_user_id ON public.import_jobs(user_id)
-- - idx_import_logs_user_id ON public.import_logs(user_id)
-- - idx_import_templates_user_id ON public.import_templates(user_id)
-- - idx_deck_comments_user_id ON public.deck_comments(user_id)
-- - idx_deck_shares_shared_by ON public.deck_shares(shared_by)
-- - idx_user_api_keys_user_id ON public.user_api_keys(user_id)
-- - idx_user_preferences_user_id ON public.user_preferences(user_id)
-- - idx_user_profile_extended_user_id ON public.user_profile_extended(user_id)
-- - idx_user_activity_logs_user_id ON public.user_activity_logs(user_id)
-- - idx_api_usage_stats_user_id ON public.api_usage_stats(user_id)

-- 5. VÉRIFICATION DES CORRECTIONS
-- =====================================================

-- Vérification que les politiques sont correctement appliquées
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

-- Vérification des index existants (déjà présents selon votre liste)
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname; 