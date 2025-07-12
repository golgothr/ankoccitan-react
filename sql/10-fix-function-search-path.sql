-- =====================================================
-- CORRECTION DES FONCTIONS AVEC SEARCH_PATH MUTABLE
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