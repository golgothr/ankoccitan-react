-- Création des tables pour la communauté Ankòccitan
-- À exécuter dans le SQL Editor de Supabase après 03-import.sql

-- =====================================================
-- TABLE DECK_COMMENTS
-- =====================================================

-- Créer la table pour les commentaires sur les decks
CREATE TABLE IF NOT EXISTS public.deck_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_public BOOLEAN DEFAULT true,
    parent_comment_id UUID REFERENCES public.deck_comments(id) ON DELETE CASCADE, -- Pour les réponses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_deck_comments_deck_id ON public.deck_comments(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_comments_user_id ON public.deck_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_deck_comments_rating ON public.deck_comments(rating);
CREATE INDEX IF NOT EXISTS idx_deck_comments_created_at ON public.deck_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deck_comments_parent_id ON public.deck_comments(parent_comment_id);

-- =====================================================
-- TABLE DECK_DOWNLOADS
-- =====================================================

-- Créer la table pour tracer les téléchargements de decks
CREATE TABLE IF NOT EXISTS public.deck_downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_count INTEGER DEFAULT 1, -- Nombre de téléchargements par utilisateur
    UNIQUE(deck_id, user_id)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_deck_downloads_deck_id ON public.deck_downloads(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_downloads_user_id ON public.deck_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_deck_downloads_downloaded_at ON public.deck_downloads(downloaded_at DESC);

-- =====================================================
-- TABLE DECK_FAVORITES
-- =====================================================

-- Créer la table pour les favoris des utilisateurs
CREATE TABLE IF NOT EXISTS public.deck_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(deck_id, user_id)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_deck_favorites_deck_id ON public.deck_favorites(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_favorites_user_id ON public.deck_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_deck_favorites_favorited_at ON public.deck_favorites(favorited_at DESC);

-- =====================================================
-- TABLE DECK_SHARES
-- =====================================================

-- Créer la table pour gérer le partage de decks
CREATE TABLE IF NOT EXISTS public.deck_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    shared_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    shared_with UUID REFERENCES public.users(id) ON DELETE CASCADE,
    share_type TEXT CHECK (share_type IN ('public', 'private', 'link')) DEFAULT 'public',
    share_link TEXT, -- URL de partage unique
    expires_at TIMESTAMP WITH TIME ZONE, -- Expiration du partage
    is_active BOOLEAN DEFAULT true,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_deck_shares_deck_id ON public.deck_shares(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_shares_shared_by ON public.deck_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_deck_shares_shared_with ON public.deck_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_deck_shares_share_link ON public.deck_shares(share_link);
CREATE INDEX IF NOT EXISTS idx_deck_shares_is_active ON public.deck_shares(is_active);

-- =====================================================
-- TABLE DECK_STATS
-- =====================================================

-- Créer la table pour les statistiques des decks
CREATE TABLE IF NOT EXISTS public.deck_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_downloads INTEGER DEFAULT 0,
    total_favorites INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_deck_stats_total_downloads ON public.deck_stats(total_downloads DESC);
CREATE INDEX IF NOT EXISTS idx_deck_stats_average_rating ON public.deck_stats(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_deck_stats_last_activity ON public.deck_stats(last_activity DESC);

-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

-- Trigger pour mettre à jour updated_at sur deck_comments
DROP TRIGGER IF EXISTS update_deck_comments_updated_at ON public.deck_comments;
CREATE TRIGGER update_deck_comments_updated_at 
    BEFORE UPDATE ON public.deck_comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur deck_stats
DROP TRIGGER IF EXISTS update_deck_stats_updated_at ON public.deck_stats;
CREATE TRIGGER update_deck_stats_updated_at 
    BEFORE UPDATE ON public.deck_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour automatiquement les statistiques des decks
CREATE OR REPLACE FUNCTION update_deck_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour ou créer les statistiques du deck
    INSERT INTO public.deck_stats (deck_id, total_downloads, total_favorites, total_comments, average_rating, total_ratings, last_activity)
    VALUES (
        COALESCE(NEW.deck_id, OLD.deck_id),
        (SELECT COUNT(*) FROM public.deck_downloads WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id)),
        (SELECT COUNT(*) FROM public.deck_favorites WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id)),
        (SELECT COUNT(*) FROM public.deck_comments WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id)),
        (SELECT COALESCE(AVG(rating), 0) FROM public.deck_comments WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id) AND rating IS NOT NULL),
        (SELECT COUNT(*) FROM public.deck_comments WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id) AND rating IS NOT NULL),
        NOW()
    )
    ON CONFLICT (deck_id) DO UPDATE SET
        total_downloads = EXCLUDED.total_downloads,
        total_favorites = EXCLUDED.total_favorites,
        total_comments = EXCLUDED.total_comments,
        average_rating = EXCLUDED.average_rating,
        total_ratings = EXCLUDED.total_ratings,
        last_activity = EXCLUDED.last_activity,
        updated_at = NOW();
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers pour maintenir les statistiques à jour
DROP TRIGGER IF EXISTS update_deck_stats_downloads ON public.deck_downloads;
CREATE TRIGGER update_deck_stats_downloads
    AFTER INSERT OR UPDATE OR DELETE ON public.deck_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_stats();

DROP TRIGGER IF EXISTS update_deck_stats_favorites ON public.deck_favorites;
CREATE TRIGGER update_deck_stats_favorites
    AFTER INSERT OR DELETE ON public.deck_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_stats();

DROP TRIGGER IF EXISTS update_deck_stats_comments ON public.deck_comments;
CREATE TRIGGER update_deck_stats_comments
    AFTER INSERT OR UPDATE OR DELETE ON public.deck_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_stats();

-- Fonction pour incrémenter le compteur de téléchargements
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Nouveau téléchargement
        NEW.download_count = 1;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Téléchargement existant, incrémenter le compteur
        NEW.download_count = OLD.download_count + 1;
        NEW.downloaded_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour incrémenter le compteur de téléchargements
DROP TRIGGER IF EXISTS increment_download_count_trigger ON public.deck_downloads;
CREATE TRIGGER increment_download_count_trigger
    BEFORE INSERT OR UPDATE ON public.deck_downloads
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count();

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table deck_comments
ALTER TABLE public.deck_comments ENABLE ROW LEVEL SECURITY;

-- Politiques pour deck_comments
DROP POLICY IF EXISTS "Users can view public comments" ON public.deck_comments;
CREATE POLICY "Users can view public comments" ON public.deck_comments
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view own comments" ON public.deck_comments;
CREATE POLICY "Users can view own comments" ON public.deck_comments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create comments on public decks" ON public.deck_comments;
CREATE POLICY "Users can create comments on public decks" ON public.deck_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = deck_comments.deck_id 
            AND decks.is_public = true
        )
    );

DROP POLICY IF EXISTS "Users can update own comments" ON public.deck_comments;
CREATE POLICY "Users can update own comments" ON public.deck_comments
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.deck_comments;
CREATE POLICY "Users can delete own comments" ON public.deck_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Activer RLS sur la table deck_downloads
ALTER TABLE public.deck_downloads ENABLE ROW LEVEL SECURITY;

-- Politiques pour deck_downloads
DROP POLICY IF EXISTS "Users can view own downloads" ON public.deck_downloads;
CREATE POLICY "Users can view own downloads" ON public.deck_downloads
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can download public decks" ON public.deck_downloads;
CREATE POLICY "Users can download public decks" ON public.deck_downloads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = deck_downloads.deck_id 
            AND decks.is_public = true
        )
    );

DROP POLICY IF EXISTS "Users can update own downloads" ON public.deck_downloads;
CREATE POLICY "Users can update own downloads" ON public.deck_downloads
    FOR UPDATE USING (auth.uid() = user_id);

-- Activer RLS sur la table deck_favorites
ALTER TABLE public.deck_favorites ENABLE ROW LEVEL SECURITY;

-- Politiques pour deck_favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.deck_favorites;
CREATE POLICY "Users can view own favorites" ON public.deck_favorites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can favorite public decks" ON public.deck_favorites;
CREATE POLICY "Users can favorite public decks" ON public.deck_favorites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = deck_favorites.deck_id 
            AND decks.is_public = true
        )
    );

DROP POLICY IF EXISTS "Users can remove own favorites" ON public.deck_favorites;
CREATE POLICY "Users can remove own favorites" ON public.deck_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Activer RLS sur la table deck_shares
ALTER TABLE public.deck_shares ENABLE ROW LEVEL SECURITY;

-- Politiques pour deck_shares
DROP POLICY IF EXISTS "Users can view own shares" ON public.deck_shares;
CREATE POLICY "Users can view own shares" ON public.deck_shares
    FOR SELECT USING (auth.uid() = shared_by);

DROP POLICY IF EXISTS "Users can view shares with them" ON public.deck_shares;
CREATE POLICY "Users can view shares with them" ON public.deck_shares
    FOR SELECT USING (auth.uid() = shared_with);

DROP POLICY IF EXISTS "Users can view public shares" ON public.deck_shares;
CREATE POLICY "Users can view public shares" ON public.deck_shares
    FOR SELECT USING (share_type = 'public');

DROP POLICY IF EXISTS "Users can create shares for own decks" ON public.deck_shares;
CREATE POLICY "Users can create shares for own decks" ON public.deck_shares
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = deck_shares.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own shares" ON public.deck_shares;
CREATE POLICY "Users can update own shares" ON public.deck_shares
    FOR UPDATE USING (auth.uid() = shared_by);

DROP POLICY IF EXISTS "Users can delete own shares" ON public.deck_shares;
CREATE POLICY "Users can delete own shares" ON public.deck_shares
    FOR DELETE USING (auth.uid() = shared_by);

-- Activer RLS sur la table deck_stats
ALTER TABLE public.deck_stats ENABLE ROW LEVEL SECURITY;

-- Politiques pour deck_stats (lecture publique, écriture automatique)
DROP POLICY IF EXISTS "Anyone can view deck stats" ON public.deck_stats;
CREATE POLICY "Anyone can view deck stats" ON public.deck_stats
    FOR SELECT USING (true);

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour obtenir les decks publics avec leurs statistiques
CREATE OR REPLACE VIEW public.public_decks_with_stats AS
SELECT 
    d.*,
    u.name as creator_name,
    u.username as creator_username,
    ds.total_downloads,
    ds.total_favorites,
    ds.total_comments,
    ds.average_rating,
    ds.total_ratings,
    ds.last_activity
FROM public.decks d
JOIN public.users u ON d.user_id = u.id
LEFT JOIN public.deck_stats ds ON d.id = ds.deck_id
WHERE d.is_public = true;

-- Vue pour obtenir les commentaires avec les informations utilisateur
CREATE OR REPLACE VIEW public.deck_comments_with_users AS
SELECT 
    dc.*,
    u.name as user_name,
    u.username as user_username,
    d.title as deck_title,
    d.is_public as deck_is_public
FROM public.deck_comments dc
JOIN public.users u ON dc.user_id = u.id
JOIN public.decks d ON dc.deck_id = d.id
WHERE dc.is_public = true;

-- Vue pour obtenir les decks favoris d'un utilisateur
CREATE OR REPLACE VIEW public.user_favorites AS
SELECT 
    df.*,
    d.title as deck_title,
    d.description as deck_description,
    d.card_count,
    d.difficulty_level,
    d.language,
    u.name as creator_name,
    u.username as creator_username,
    ds.total_downloads,
    ds.average_rating
FROM public.deck_favorites df
JOIN public.decks d ON df.deck_id = d.id
JOIN public.users u ON d.user_id = u.id
LEFT JOIN public.deck_stats ds ON d.id = ds.deck_id;

-- Vue pour obtenir les decks les plus populaires
CREATE OR REPLACE VIEW public.popular_decks AS
SELECT 
    d.*,
    u.name as creator_name,
    u.username as creator_username,
    ds.total_downloads,
    ds.total_favorites,
    ds.average_rating,
    ds.total_ratings,
    ROW_NUMBER() OVER (ORDER BY ds.total_downloads DESC, ds.average_rating DESC) as popularity_rank
FROM public.decks d
JOIN public.users u ON d.user_id = u.id
JOIN public.deck_stats ds ON d.id = ds.deck_id
WHERE d.is_public = true
AND ds.total_downloads > 0;

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les decks recommandés pour un utilisateur
CREATE OR REPLACE FUNCTION get_recommended_decks(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    deck_id UUID,
    title TEXT,
    description TEXT,
    creator_name TEXT,
    average_rating DECIMAL(3,2),
    total_downloads INTEGER,
    recommendation_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.description,
        u.name,
        ds.average_rating,
        ds.total_downloads,
        (ds.average_rating * 0.4 + (ds.total_downloads::DECIMAL / 100) * 0.6) as recommendation_score
    FROM public.decks d
    JOIN public.users u ON d.user_id = u.id
    JOIN public.deck_stats ds ON d.id = ds.deck_id
    WHERE d.is_public = true
    AND d.id NOT IN (
        SELECT deck_id FROM public.deck_favorites WHERE user_id = user_uuid
    )
    AND d.id NOT IN (
        SELECT deck_id FROM public.deck_downloads WHERE user_id = user_uuid
    )
    ORDER BY recommendation_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 