-- CORRECTION DE LA TABLE USER_API_KEYS
-- À exécuter dans le SQL Editor de Supabase si vous avez des erreurs 406

-- =====================================================
-- VÉRIFICATION ET CRÉATION DE LA TABLE
-- =====================================================

-- Créer la table user_api_keys si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    service_name TEXT CHECK (service_name IN ('revirada', 'votz', 'pexels')) NOT NULL,
    api_key TEXT NOT NULL,
    api_secret TEXT, -- Pour les services qui nécessitent un secret
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    rate_limit_remaining INTEGER, -- Limite d'utilisation restante
    rate_limit_reset_at TIMESTAMP WITH TIME ZONE, -- Quand la limite se réinitialise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_service ON public.user_api_keys(service_name);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_is_active ON public.user_api_keys(is_active);

-- =====================================================
-- CONFIGURATION RLS
-- =====================================================

-- Activer RLS sur la table user_api_keys
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can manage own api keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_api_keys;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_api_keys;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_api_keys;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.user_api_keys;

-- Créer les nouvelles politiques RLS
CREATE POLICY "Users can manage own api keys" ON public.user_api_keys
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGER POUR UPDATED_AT
-- =====================================================

-- Trigger pour mettre à jour updated_at sur user_api_keys
DROP TRIGGER IF EXISTS update_user_api_keys_updated_at ON public.user_api_keys;
CREATE TRIGGER update_user_api_keys_updated_at 
    BEFORE UPDATE ON public.user_api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que la table existe et a les bonnes colonnes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_api_keys' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
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
WHERE tablename = 'user_api_keys';

-- Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_api_keys'; 