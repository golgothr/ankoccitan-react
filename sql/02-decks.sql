-- Création des tables decks et cards pour Ankòccitan
-- À exécuter dans le SQL Editor de Supabase après 01-users.sql

-- =====================================================
-- TABLE DECKS
-- =====================================================

-- Créer la table decks
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    is_public BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'oc', -- occitan
    difficulty_level TEXT CHECK (difficulty_level IN ('débutant', 'intermédiaire', 'avancé')) DEFAULT 'débutant',
    card_count INTEGER DEFAULT 0,
    tags TEXT[], -- Tags pour catégoriser les decks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_is_public ON public.decks(is_public);
CREATE INDEX IF NOT EXISTS idx_decks_language ON public.decks(language);
CREATE INDEX IF NOT EXISTS idx_decks_difficulty ON public.decks(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_decks_created_at ON public.decks(created_at DESC);

-- =====================================================
-- TABLE CARDS
-- =====================================================

-- Créer la table cards avec support des 3 types d'APIs
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    card_type TEXT CHECK (card_type IN ('revirada', 'votz', 'pexels', 'manual')) DEFAULT 'manual',
    front_content TEXT NOT NULL, -- Terme en français
    back_content TEXT NOT NULL,  -- Terme en occitan
    pronunciation TEXT, -- Prononciation phonétique
    audio_url TEXT, -- URL audio générée par Votz
    image_url TEXT, -- URL image de Pexels
    api_metadata JSONB, -- Stockage des métadonnées des APIs (réponse complète)
    position INTEGER, -- Ordre des cartes dans le deck
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_card_type ON public.cards(card_type);
CREATE INDEX IF NOT EXISTS idx_cards_position ON public.cards(deck_id, position);

-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

-- Trigger pour mettre à jour updated_at sur decks
DROP TRIGGER IF EXISTS update_decks_updated_at ON public.decks;
CREATE TRIGGER update_decks_updated_at 
    BEFORE UPDATE ON public.decks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur cards
DROP TRIGGER IF EXISTS update_cards_updated_at ON public.cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON public.cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour automatiquement le nombre de cartes dans un deck
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.decks 
        SET card_count = card_count + 1 
        WHERE id = NEW.deck_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.decks 
        SET card_count = card_count - 1 
        WHERE id = OLD.deck_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour maintenir le compteur de cartes à jour
DROP TRIGGER IF EXISTS update_deck_card_count_insert ON public.cards;
CREATE TRIGGER update_deck_card_count_insert
    AFTER INSERT ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_card_count();

DROP TRIGGER IF EXISTS update_deck_card_count_delete ON public.cards;
CREATE TRIGGER update_deck_card_count_delete
    AFTER DELETE ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION update_deck_card_count();

-- Fonction pour assigner automatiquement la position d'une carte
CREATE OR REPLACE FUNCTION assign_card_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.position IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1 
        INTO NEW.position 
        FROM public.cards 
        WHERE deck_id = NEW.deck_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour assigner automatiquement la position
DROP TRIGGER IF EXISTS assign_card_position_trigger ON public.cards;
CREATE TRIGGER assign_card_position_trigger
    BEFORE INSERT ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION assign_card_position();

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table decks
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Politiques pour les decks
DROP POLICY IF EXISTS "Users can view own decks" ON public.decks;
CREATE POLICY "Users can view own decks" ON public.decks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public decks" ON public.decks;
CREATE POLICY "Users can view public decks" ON public.decks
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can create own decks" ON public.decks;
CREATE POLICY "Users can create own decks" ON public.decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own decks" ON public.decks;
CREATE POLICY "Users can update own decks" ON public.decks
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own decks" ON public.decks;
CREATE POLICY "Users can delete own decks" ON public.decks
    FOR DELETE USING (auth.uid() = user_id);

-- Activer RLS sur la table cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Politiques pour les cartes (basées sur le deck parent)
DROP POLICY IF EXISTS "Users can view cards from own decks" ON public.cards;
CREATE POLICY "Users can view cards from own decks" ON public.cards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can view cards from public decks" ON public.cards;
CREATE POLICY "Users can view cards from public decks" ON public.cards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = cards.deck_id 
            AND decks.is_public = true
        )
    );

DROP POLICY IF EXISTS "Users can create cards in own decks" ON public.cards;
CREATE POLICY "Users can create cards in own decks" ON public.cards
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update cards in own decks" ON public.cards;
CREATE POLICY "Users can update cards in own decks" ON public.cards
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete cards in own decks" ON public.cards;
CREATE POLICY "Users can delete cards in own decks" ON public.cards
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE decks.id = cards.deck_id 
            AND decks.user_id = auth.uid()
        )
    );

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour obtenir les decks avec le nombre de cartes
CREATE OR REPLACE VIEW public.decks_with_card_count AS
SELECT 
    d.*,
    u.name as creator_name,
    u.username as creator_username
FROM public.decks d
JOIN public.users u ON d.user_id = u.id;

-- Vue pour obtenir les cartes avec les informations du deck
CREATE OR REPLACE VIEW public.cards_with_deck_info AS
SELECT 
    c.*,
    d.title as deck_title,
    d.is_public as deck_is_public,
    d.user_id as deck_owner_id
FROM public.cards c
JOIN public.decks d ON c.deck_id = d.id; 