-- =====================================================
-- CORRECTIONS DE PERFORMANCE RLS - VERSION MINIMALE
-- =====================================================

-- 1. CORRECTION DES APPELS AUTH DANS LES POLITIQUES RLS
-- =====================================================

-- Table users (vérifiée)
ALTER POLICY "Users can view own profile" ON public.users 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile" ON public.users 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can insert own profile" ON public.users 
WITH CHECK ((select auth.uid()) = id);

ALTER POLICY "Users can delete own profile" ON public.users 
USING ((select auth.uid()) = id);

-- Table decks (vérifiée)
ALTER POLICY "Users can view own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can create own decks" ON public.decks 
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can update own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can delete own decks" ON public.decks 
USING ((select auth.uid()) = user_id);

-- Table cards (vérifiée)
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

-- 2. CONSOLIDATION DES POLITIQUES MULTIPLES
-- =====================================================

-- Suppression des politiques redondantes pour les tables avec accès public
DROP POLICY IF EXISTS "Allow read for all" ON public.users;
DROP POLICY IF EXISTS "Users can view public decks" ON public.decks;
DROP POLICY IF EXISTS "Users can view cards from public decks" ON public.cards;

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

-- 4. INDEX POUR AMÉLIORER LES PERFORMANCES
-- =====================================================

-- Index pour les jointures fréquentes
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);

-- Index pour les filtres de visibilité
CREATE INDEX IF NOT EXISTS idx_decks_is_public ON public.decks(is_public);

-- Index pour les recherches par utilisateur
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);

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
  AND tablename IN ('users', 'decks', 'cards')
ORDER BY tablename, policyname;

-- Vérification des index créés
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'decks', 'cards')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname; 