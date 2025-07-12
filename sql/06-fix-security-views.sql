-- Script pour corriger les alertes de sécurité Supabase
-- Suppression des vues avec SECURITY DEFINER et remplacement par des alternatives sécurisées

-- 1. Supprimer les vues problématiques
DROP VIEW IF EXISTS public.deck_comments_with_users;
DROP VIEW IF EXISTS public.user_complete_profile;
DROP VIEW IF EXISTS public.popular_decks;
DROP VIEW IF EXISTS public.active_api_keys_with_stats;
DROP VIEW IF EXISTS public.decks_with_card_count;
DROP VIEW IF EXISTS public.user_api_usage_summary;
DROP VIEW IF EXISTS public.import_logs_with_details;
DROP VIEW IF EXISTS public.cards_with_deck_info;
DROP VIEW IF EXISTS public.user_favorites;
DROP VIEW IF EXISTS public.import_jobs_with_stats;
DROP VIEW IF EXISTS public.public_decks_with_stats;

-- 2. Créer des fonctions sécurisées pour remplacer les vues

-- Fonction pour récupérer les commentaires avec les utilisateurs
CREATE OR REPLACE FUNCTION public.get_deck_comments_with_users(p_deck_id UUID)
RETURNS TABLE (
  comment_id UUID,
  comment_deck_id UUID,
  comment_user_id UUID,
  comment_content TEXT,
  comment_created_at TIMESTAMPTZ,
  user_name TEXT,
  user_username TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.deck_id,
    c.user_id,
    c.content,
    c.created_at,
    u.name,
    u.username
  FROM public.deck_comments c
  JOIN public.users u ON c.user_id = u.id
  WHERE c.deck_id = p_deck_id
  ORDER BY c.created_at DESC;
END;
$$;

-- Fonction pour récupérer le profil complet d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_username TEXT,
  user_email TEXT,
  user_created_at TIMESTAMPTZ,
  deck_count BIGINT,
  card_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.username,
    u.email,
    u.created_at,
    COUNT(DISTINCT d.id)::BIGINT as deck_count,
    COUNT(DISTINCT c.id)::BIGINT as card_count
  FROM public.users u
  LEFT JOIN public.decks d ON u.id = d.user_id
  LEFT JOIN public.cards c ON d.id = c.deck_id
  WHERE u.id = p_user_id
  GROUP BY u.id, u.name, u.username, u.email, u.created_at;
END;
$$;

-- Fonction pour récupérer les decks populaires
CREATE OR REPLACE FUNCTION public.get_popular_decks(p_limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  deck_id UUID,
  deck_title TEXT,
  deck_description TEXT,
  deck_user_id UUID,
  deck_is_public BOOLEAN,
  deck_created_at TIMESTAMPTZ,
  card_count BIGINT,
  user_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.description,
    d.user_id,
    d.is_public,
    d.created_at,
    COUNT(c.id)::BIGINT as card_count,
    u.name
  FROM public.decks d
  JOIN public.users u ON d.user_id = u.id
  LEFT JOIN public.cards c ON d.id = c.deck_id
  WHERE d.is_public = true
  GROUP BY d.id, d.title, d.description, d.user_id, d.is_public, d.created_at, u.name
  ORDER BY card_count DESC, d.created_at DESC
  LIMIT p_limit_count;
END;
$$;

-- Fonction pour récupérer les statistiques des decks
CREATE OR REPLACE FUNCTION public.get_deck_stats(p_user_id UUID)
RETURNS TABLE (
  total_decks BIGINT,
  total_cards BIGINT,
  public_decks BIGINT,
  private_decks BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT d.id)::BIGINT as total_decks,
    COUNT(c.id)::BIGINT as total_cards,
    COUNT(DISTINCT CASE WHEN d.is_public THEN d.id END)::BIGINT as public_decks,
    COUNT(DISTINCT CASE WHEN NOT d.is_public THEN d.id END)::BIGINT as private_decks
  FROM public.decks d
  LEFT JOIN public.cards c ON d.id = c.deck_id
  WHERE d.user_id = p_user_id;
END;
$$;

-- 3. Créer des politiques RLS appropriées pour les nouvelles fonctions

-- Politique pour get_deck_comments_with_users
GRANT EXECUTE ON FUNCTION public.get_deck_comments_with_users(UUID) TO authenticated;

-- Politique pour get_user_complete_profile
GRANT EXECUTE ON FUNCTION public.get_user_complete_profile(UUID) TO authenticated;

-- Politique pour get_popular_decks
GRANT EXECUTE ON FUNCTION public.get_popular_decks(INTEGER) TO authenticated;

-- Politique pour get_deck_stats
GRANT EXECUTE ON FUNCTION public.get_deck_stats(UUID) TO authenticated;

-- 4. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_deck_comments_deck_id ON public.deck_comments(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_comments_user_id ON public.deck_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_is_public ON public.decks(is_public);

-- 5. Commentaires pour documenter les changements
COMMENT ON FUNCTION public.get_deck_comments_with_users(UUID) IS 'Récupère les commentaires d''un deck avec les informations utilisateur';
COMMENT ON FUNCTION public.get_user_complete_profile(UUID) IS 'Récupère le profil complet d''un utilisateur avec ses statistiques';
COMMENT ON FUNCTION public.get_popular_decks(INTEGER) IS 'Récupère les decks les plus populaires basés sur le nombre de cartes';
COMMENT ON FUNCTION public.get_deck_stats(UUID) IS 'Récupère les statistiques des decks d''un utilisateur'; 