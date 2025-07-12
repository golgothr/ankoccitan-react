-- =====================================================
-- CORRECTION DES FONCTIONS AVEC SEARCH_PATH MUTABLE - VERSION SÛRE
-- =====================================================

-- Suppression des fonctions existantes avant recréation
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_deck_card_count() CASCADE;
DROP FUNCTION IF EXISTS assign_card_position() CASCADE;
DROP FUNCTION IF EXISTS update_import_progress() CASCADE;
DROP FUNCTION IF EXISTS assign_import_processing_order() CASCADE;
DROP FUNCTION IF EXISTS update_deck_stats() CASCADE;
DROP FUNCTION IF EXISTS increment_download_count() CASCADE;
DROP FUNCTION IF EXISTS create_user_preferences() CASCADE;
DROP FUNCTION IF EXISTS log_user_activity(uuid,text,jsonb,inet,text) CASCADE;
DROP FUNCTION IF EXISTS update_api_usage_stats(uuid,text,uuid,boolean,integer) CASCADE;
DROP FUNCTION IF EXISTS get_user_api_usage(uuid,integer) CASCADE;
DROP FUNCTION IF EXISTS has_active_api_keys(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_defaults(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_deck_comments_with_users(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_complete_profile(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_popular_decks(integer) CASCADE;
DROP FUNCTION IF EXISTS get_deck_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_recommended_decks(uuid,integer) CASCADE;

-- =====================================================
-- RECRÉATION DES FONCTIONS AVEC SEARCH_PATH FIXE
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = public;

-- Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'),
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

-- Fonction pour mettre à jour automatiquement le pourcentage de progression
CREATE OR REPLACE FUNCTION update_import_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.import_jobs 
        SET 
            processed_words = (
                SELECT COUNT(*) 
                FROM public.import_logs 
                WHERE import_job_id = NEW.import_job_id
            ),
            successful_imports = (
                SELECT COUNT(*) 
                FROM public.import_logs 
                WHERE import_job_id = NEW.import_job_id 
                AND status = 'completed'
            ),
            failed_imports = (
                SELECT COUNT(*) 
                FROM public.import_logs 
                WHERE import_job_id = NEW.import_job_id 
                AND status = 'failed'
            ),
            progress_percentage = CASE 
                WHEN total_words > 0 THEN 
                    ROUND((processed_words::DECIMAL / total_words) * 100)
                ELSE 0 
            END,
            updated_at = NOW()
        WHERE id = NEW.import_job_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fonction pour assigner automatiquement l'ordre de traitement
CREATE OR REPLACE FUNCTION assign_import_processing_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.processing_order IS NULL THEN
        SELECT COALESCE(MAX(processing_order), 0) + 1 
        INTO NEW.processing_order 
        FROM public.import_logs 
        WHERE import_job_id = NEW.import_job_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir l'utilisation des APIs d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_api_usage(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    service_name TEXT,
    total_requests INTEGER,
    success_rate DECIMAL(5,2),
    avg_response_time_ms INTEGER,
    last_used_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aus.service_name,
        SUM(aus.request_count) as total_requests,
        ROUND(
            (SUM(aus.success_count)::DECIMAL / NULLIF(SUM(aus.request_count), 0)) * 100, 
            2
        ) as success_rate,
        ROUND(AVG(aus.total_response_time_ms / NULLIF(aus.request_count, 0))) as avg_response_time_ms,
        MAX(aus.date) as last_used_date
    FROM public.api_usage_stats aus
    WHERE aus.user_id = user_uuid
      AND aus.date >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY aus.service_name
    ORDER BY total_requests DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir les valeurs par défaut d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_defaults(user_uuid UUID)
RETURNS TABLE (
    default_language TEXT,
    auto_generate_audio BOOLEAN,
    auto_generate_images BOOLEAN,
    theme TEXT,
    timezone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.default_language,
        up.auto_generate_audio,
        up.auto_generate_images,
        up.theme,
        up.timezone
    FROM public.user_preferences up
    WHERE up.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir les commentaires d'un deck avec les utilisateurs
CREATE OR REPLACE FUNCTION get_deck_comments_with_users(deck_uuid UUID)
RETURNS TABLE (
    comment_id UUID,
    comment_text TEXT,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    user_name TEXT,
    user_username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dc.id as comment_id,
        dc.comment as comment_text,
        dc.rating,
        dc.created_at,
        u.name as user_name,
        u.username as user_username
    FROM public.deck_comments dc
    JOIN public.users u ON dc.user_id = u.id
    WHERE dc.deck_id = deck_uuid
      AND dc.is_public = true
    ORDER BY dc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir le profil complet d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_complete_profile(user_uuid UUID)
RETURNS TABLE (
    user_id UUID,
    name TEXT,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    native_language TEXT,
    experience_level TEXT,
    is_public_profile BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.name,
        u.username,
        u.email,
        upe.avatar_url,
        upe.bio,
        upe.location,
        upe.website,
        upe.native_language,
        upe.experience_level,
        upe.is_public_profile
    FROM public.users u
    LEFT JOIN public.user_profile_extended upe ON u.id = upe.user_id
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir les decks populaires
CREATE OR REPLACE FUNCTION get_popular_decks(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    deck_id UUID,
    title TEXT,
    description TEXT,
    creator_name TEXT,
    total_downloads INTEGER,
    average_rating DECIMAL(3,2),
    total_ratings INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as deck_id,
        d.title,
        d.description,
        u.name as creator_name,
        ds.total_downloads,
        ds.average_rating,
        ds.total_ratings
    FROM public.decks d
    JOIN public.users u ON d.user_id = u.id
    LEFT JOIN public.deck_stats ds ON d.id = ds.deck_id
    WHERE d.is_public = true
    ORDER BY ds.total_downloads DESC, ds.average_rating DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir les statistiques d'un deck
CREATE OR REPLACE FUNCTION get_deck_stats(deck_uuid UUID)
RETURNS TABLE (
    total_downloads INTEGER,
    total_favorites INTEGER,
    total_comments INTEGER,
    average_rating DECIMAL(3,2),
    total_ratings INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ds.total_downloads,
        ds.total_favorites,
        ds.total_comments,
        ds.average_rating,
        ds.total_ratings,
        ds.last_activity
    FROM public.deck_stats ds
    WHERE ds.deck_id = deck_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fonction pour obtenir les decks recommandés
CREATE OR REPLACE FUNCTION get_recommended_decks(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    deck_id UUID,
    title TEXT,
    description TEXT,
    creator_name TEXT,
    match_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as deck_id,
        d.title,
        d.description,
        u.name as creator_name,
        'Popular deck' as match_reason
    FROM public.decks d
    JOIN public.users u ON d.user_id = u.id
    LEFT JOIN public.deck_stats ds ON d.id = ds.deck_id
    WHERE d.is_public = true
      AND d.id NOT IN (
          SELECT DISTINCT deck_id 
          FROM public.deck_favorites 
          WHERE user_id = user_uuid
      )
    ORDER BY ds.total_downloads DESC, ds.average_rating DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- RECRÉATION DES TRIGGERS
-- =====================================================

-- Trigger pour mettre à jour updated_at sur users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer automatiquement un profil utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- Trigger pour assigner automatiquement la position
DROP TRIGGER IF EXISTS assign_card_position_trigger ON public.cards;
CREATE TRIGGER assign_card_position_trigger
    BEFORE INSERT ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION assign_card_position();

-- Trigger pour mettre à jour updated_at sur import_jobs
DROP TRIGGER IF EXISTS update_import_jobs_updated_at ON public.import_jobs;
CREATE TRIGGER update_import_jobs_updated_at 
    BEFORE UPDATE ON public.import_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour updated_at sur import_templates
DROP TRIGGER IF EXISTS update_import_templates_updated_at ON public.import_templates;
CREATE TRIGGER update_import_templates_updated_at 
    BEFORE UPDATE ON public.import_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour la progression
DROP TRIGGER IF EXISTS update_import_progress_trigger ON public.import_logs;
CREATE TRIGGER update_import_progress_trigger
    AFTER INSERT OR UPDATE ON public.import_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_import_progress();

-- Trigger pour assigner automatiquement l'ordre de traitement
DROP TRIGGER IF EXISTS assign_import_processing_order_trigger ON public.import_logs;
CREATE TRIGGER assign_import_processing_order_trigger
    BEFORE INSERT ON public.import_logs
    FOR EACH ROW
    EXECUTE FUNCTION assign_import_processing_order();

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

-- Trigger pour incrémenter le compteur de téléchargements
DROP TRIGGER IF EXISTS increment_download_count_trigger ON public.deck_downloads;
CREATE TRIGGER increment_download_count_trigger
    BEFORE INSERT OR UPDATE ON public.deck_downloads
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count();

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

-- Trigger pour créer automatiquement les préférences lors de l'inscription
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON public.users;
CREATE TRIGGER create_user_preferences_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_preferences(); 