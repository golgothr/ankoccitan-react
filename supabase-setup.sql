-- Configuration des tables pour AnkiOccitan
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des decks
CREATE TABLE IF NOT EXISTS decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('grammar', 'conjugation', 'vocabulary', 'expressions', 'culture')),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_studied TIMESTAMP WITH TIME ZONE,
  study_count INTEGER DEFAULT 0,
  average_score DECIMAL(3,2) DEFAULT 0.00
);

-- Table des cartes
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_category ON decks(category);
CREATE INDEX IF NOT EXISTS idx_decks_created_at ON decks(created_at);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_next_review ON cards(next_review);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour card_count automatiquement
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE decks SET card_count = card_count + 1 WHERE id = NEW.deck_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE decks SET card_count = card_count - 1 WHERE id = OLD.deck_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers pour maintenir card_count à jour
CREATE TRIGGER update_deck_card_count_insert AFTER INSERT ON cards
  FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

CREATE TRIGGER update_deck_card_count_delete AFTER DELETE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

-- Politiques RLS (Row Level Security)
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Politiques pour les decks
CREATE POLICY "Users can view their own decks" ON decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les cartes
CREATE POLICY "Users can view cards from their decks" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert cards in their decks" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in their decks" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in their decks" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

-- Données de test (optionnel)
INSERT INTO decks (name, description, category, tags, is_public, user_id) VALUES
  ('Vocabulaire de base', 'Mots essentiels pour commencer l''occitan', 'vocabulary', ARRAY['quotidien', 'basique'], false, auth.uid()),
  ('Conjugaison des verbes', 'Apprendre à conjuguer les verbes occitans', 'conjugation', ARRAY['grammaire', 'verbes'], false, auth.uid()),
  ('Expressions courantes', 'Phrases utiles pour la conversation', 'expressions', ARRAY['conversation', 'quotidien'], true, auth.uid())
ON CONFLICT DO NOTHING; 