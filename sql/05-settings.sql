-- Création des tables pour les paramètres utilisateur et clés API Ankòccitan
-- À exécuter dans le SQL Editor de Supabase après 04-community.sql

-- =====================================================
-- TABLE USER_API_KEYS
-- =====================================================

-- Créer la table pour les clés API des utilisateurs
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
-- TABLE USER_PREFERENCES
-- =====================================================

-- Créer la table pour les préférences utilisateur
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    default_language TEXT DEFAULT 'oc',
    auto_generate_audio BOOLEAN DEFAULT false,
    auto_generate_images BOOLEAN DEFAULT false,
    study_reminders BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    theme TEXT CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'auto',
    timezone TEXT DEFAULT 'Europe/Paris',
    daily_study_goal INTEGER DEFAULT 20, -- Nombre de cartes à étudier par jour
    weekly_study_goal INTEGER DEFAULT 100, -- Nombre de cartes à étudier par semaine
    auto_share_decks BOOLEAN DEFAULT false, -- Partager automatiquement les nouveaux decks
    show_pronunciation BOOLEAN DEFAULT true,
    show_images BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- =====================================================
-- TABLE USER_PROFILE_EXTENDED
-- =====================================================

-- Créer la table pour les informations de profil étendues
CREATE TABLE IF NOT EXISTS public.user_profile_extended (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB, -- Liens vers réseaux sociaux
    native_language TEXT DEFAULT 'fr',
    learning_languages TEXT[] DEFAULT ARRAY['oc'], -- Langues en cours d'apprentissage
    teaching_languages TEXT[] DEFAULT ARRAY['oc'], -- Langues enseignées
    interests TEXT[], -- Centres d'intérêt
    experience_level TEXT CHECK (experience_level IN ('débutant', 'intermédiaire', 'avancé', 'expert')) DEFAULT 'débutant',
    is_public_profile BOOLEAN DEFAULT true,
    allow_messages BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_user_profile_extended_user_id ON public.user_profile_extended(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_extended_is_public ON public.user_profile_extended(is_public_profile);

-- =====================================================
-- TABLE USER_ACTIVITY_LOGS
-- =====================================================

-- Créer la table pour tracer l'activité des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT CHECK (activity_type IN (
        'login', 'logout', 'deck_created', 'deck_shared', 'deck_downloaded',
        'card_created', 'study_session', 'comment_posted', 'favorite_added',
        'import_started', 'import_completed', 'settings_updated', 'api_key_added'
    )) NOT NULL,
    activity_data JSONB, -- Données détaillées de l'activité
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_activity_type ON public.user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- =====================================================
-- TABLE API_USAGE_STATS
-- =====================================================

-- Créer la table pour tracer l'utilisation des APIs
CREATE TABLE IF NOT EXISTS public.api_usage_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    service_name TEXT CHECK (service_name IN ('revirada', 'votz', 'pexels')) NOT NULL,
    api_key_id UUID REFERENCES public.user_api_keys(id) ON DELETE CASCADE,
    request_count INTEGER DEFAULT 1,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    total_response_time_ms INTEGER, -- Temps de réponse total en millisecondes
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name, date)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_api_usage_stats_user_id ON public.api_usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_stats_service ON public.api_usage_stats(service_name);
CREATE INDEX IF NOT EXISTS idx_api_usage_stats_date ON public.api_usage_stats(date);

-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

-- Trigger pour mettre à jour updated_at sur user_api_keys
DROP TRIGGER IF EXISTS update_user_api_keys_updated_at ON public.user_api_keys;
CREATE TRIGGER update_user_api_keys_updated_at 
    BEFORE UPDATE ON public.user_api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON public.user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur user_profile_extended
DROP TRIGGER IF EXISTS update_user_profile_extended_updated_at ON public.user_profile_extended;
CREATE TRIGGER update_user_profile_extended_updated_at 
    BEFORE UPDATE ON public.user_profile_extended 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur api_usage_stats
DROP TRIGGER IF EXISTS update_api_usage_stats_updated_at ON public.api_usage_stats;
CREATE TRIGGER update_api_usage_stats_updated_at 
    BEFORE UPDATE ON public.api_usage_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement les préférences utilisateur
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_profile_extended (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les préférences lors de l'inscription
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON public.users;
CREATE TRIGGER create_user_preferences_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_preferences();

-- Fonction pour tracer l'activité utilisateur
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.user_activity_logs (
        user_id, 
        activity_type, 
        activity_data, 
        ip_address, 
        user_agent
    )
    VALUES (
        p_user_id,
        p_activity_type,
        p_activity_data,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour les statistiques d'utilisation des APIs
CREATE OR REPLACE FUNCTION update_api_usage_stats(
    p_user_id UUID,
    p_service_name TEXT,
    p_api_key_id UUID,
    p_success BOOLEAN,
    p_response_time_ms INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.api_usage_stats (
        user_id,
        service_name,
        api_key_id,
        request_count,
        success_count,
        error_count,
        total_response_time_ms,
        date
    )
    VALUES (
        p_user_id,
        p_service_name,
        p_api_key_id,
        1,
        CASE WHEN p_success THEN 1 ELSE 0 END,
        CASE WHEN p_success THEN 0 ELSE 1 END,
        p_response_time_ms,
        CURRENT_DATE
    )
    ON CONFLICT (user_id, service_name, date) DO UPDATE SET
        request_count = api_usage_stats.request_count + 1,
        success_count = api_usage_stats.success_count + CASE WHEN p_success THEN 1 ELSE 0 END,
        error_count = api_usage_stats.error_count + CASE WHEN p_success THEN 0 ELSE 1 END,
        total_response_time_ms = COALESCE(api_usage_stats.total_response_time_ms, 0) + COALESCE(p_response_time_ms, 0),
        updated_at = NOW();
    
    -- Mettre à jour last_used_at sur la clé API
    UPDATE public.user_api_keys 
    SET last_used_at = NOW()
    WHERE id = p_api_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table user_api_keys
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_api_keys
DROP POLICY IF EXISTS "Users can manage own api keys" ON public.user_api_keys;
CREATE POLICY "Users can manage own api keys" ON public.user_api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Activer RLS sur la table user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Activer RLS sur la table user_profile_extended
ALTER TABLE public.user_profile_extended ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_profile_extended
DROP POLICY IF EXISTS "Users can view public profiles" ON public.user_profile_extended;
CREATE POLICY "Users can view public profiles" ON public.user_profile_extended
    FOR SELECT USING (is_public_profile = true);

DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profile_extended;
CREATE POLICY "Users can manage own profile" ON public.user_profile_extended
    FOR ALL USING (auth.uid() = user_id);

-- Activer RLS sur la table user_activity_logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_activity_logs
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activity_logs;
CREATE POLICY "Users can view own activity logs" ON public.user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Activer RLS sur la table api_usage_stats
ALTER TABLE public.api_usage_stats ENABLE ROW LEVEL SECURITY;

-- Politiques pour api_usage_stats
DROP POLICY IF EXISTS "Users can view own api usage" ON public.api_usage_stats;
CREATE POLICY "Users can view own api usage" ON public.api_usage_stats
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour obtenir le profil complet d'un utilisateur
CREATE OR REPLACE VIEW public.user_complete_profile AS
SELECT 
    u.*,
    up.default_language,
    up.auto_generate_audio,
    up.auto_generate_images,
    up.study_reminders,
    up.email_notifications,
    up.theme,
    up.daily_study_goal,
    up.weekly_study_goal,
    upe.avatar_url,
    upe.bio,
    upe.location,
    upe.website,
    upe.social_links,
    upe.native_language,
    upe.learning_languages,
    upe.teaching_languages,
    upe.interests,
    upe.experience_level,
    upe.is_public_profile,
    upe.allow_messages
FROM public.users u
LEFT JOIN public.user_preferences up ON u.id = up.user_id
LEFT JOIN public.user_profile_extended upe ON u.id = upe.user_id;

-- Vue pour obtenir les statistiques d'utilisation des APIs par utilisateur
CREATE OR REPLACE VIEW public.user_api_usage_summary AS
SELECT 
    uas.user_id,
    u.name as user_name,
    uas.service_name,
    SUM(uas.request_count) as total_requests,
    SUM(uas.success_count) as total_success,
    SUM(uas.error_count) as total_errors,
    AVG(uas.total_response_time_ms) as avg_response_time,
    MAX(uas.date) as last_used_date
FROM public.api_usage_stats uas
JOIN public.users u ON uas.user_id = u.id
GROUP BY uas.user_id, u.name, uas.service_name;

-- Vue pour obtenir les clés API actives avec statistiques
CREATE OR REPLACE VIEW public.active_api_keys_with_stats AS
SELECT 
    uak.*,
    u.name as user_name,
    uas.total_requests,
    uas.total_success,
    uas.total_errors,
    uas.last_used_date
FROM public.user_api_keys uak
JOIN public.users u ON uak.user_id = u.id
LEFT JOIN public.user_api_usage_summary uas ON uak.user_id = uas.user_id AND uak.service_name = uas.service_name
WHERE uak.is_active = true;

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques d'utilisation des APIs d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_api_usage(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    service_name TEXT,
    total_requests INTEGER,
    success_rate DECIMAL(5,2),
    avg_response_time DECIMAL(10,2),
    last_used_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uas.service_name,
        SUM(uas.request_count) as total_requests,
        CASE 
            WHEN SUM(uas.request_count) > 0 THEN 
                (SUM(uas.success_count)::DECIMAL / SUM(uas.request_count)) * 100
            ELSE 0 
        END as success_rate,
        AVG(uas.total_response_time_ms) as avg_response_time,
        MAX(uas.date) as last_used_date
    FROM public.api_usage_stats uas
    WHERE uas.user_id = user_uuid
    AND uas.date >= CURRENT_DATE - days_back
    GROUP BY uas.service_name
    ORDER BY total_requests DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur a des clés API actives
CREATE OR REPLACE FUNCTION has_active_api_keys(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_api_keys 
        WHERE user_id = user_uuid 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les préférences par défaut d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_defaults(user_uuid UUID)
RETURNS TABLE (
    default_language TEXT,
    auto_generate_audio BOOLEAN,
    auto_generate_images BOOLEAN,
    theme TEXT,
    daily_study_goal INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.default_language,
        up.auto_generate_audio,
        up.auto_generate_images,
        up.theme,
        up.daily_study_goal
    FROM public.user_preferences up
    WHERE up.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 