-- Création des tables pour l'import en masse pour Ankòccitan
-- À exécuter dans le SQL Editor de Supabase après 02-decks.sql

-- =====================================================
-- TABLE IMPORT_JOBS
-- =====================================================

-- Créer la table pour tracer les imports
CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_url TEXT, -- URL du fichier dans Supabase Storage
    import_type TEXT CHECK (import_type IN ('csv', 'txt')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    total_words INTEGER,
    processed_words INTEGER DEFAULT 0,
    successful_imports INTEGER DEFAULT 0,
    failed_imports INTEGER DEFAULT 0,
    generate_audio BOOLEAN DEFAULT false,
    generate_images BOOLEAN DEFAULT false,
    error_message TEXT,
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_import_jobs_user_id ON public.import_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON public.import_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_jobs_deck_id ON public.import_jobs(deck_id);

-- =====================================================
-- TABLE IMPORT_LOGS
-- =====================================================

-- Créer la table pour tracer les détails de chaque import
CREATE TABLE IF NOT EXISTS public.import_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    import_job_id UUID REFERENCES public.import_jobs(id) ON DELETE CASCADE NOT NULL,
    word_french TEXT NOT NULL,
    word_occitan TEXT,
    status TEXT CHECK (status IN ('pending', 'translated', 'audio_generated', 'image_generated', 'completed', 'failed')) DEFAULT 'pending',
    error_message TEXT,
    api_response JSONB, -- Réponse complète des APIs
    card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
    processing_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_import_logs_job_id ON public.import_logs(import_job_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON public.import_logs(status);
CREATE INDEX IF NOT EXISTS idx_import_logs_card_id ON public.import_logs(card_id);

-- =====================================================
-- TABLE IMPORT_TEMPLATES
-- =====================================================

-- Créer la table pour les templates d'import prédéfinis
CREATE TABLE IF NOT EXISTS public.import_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    template_config JSONB NOT NULL, -- Configuration du template (séparateurs, colonnes, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_import_templates_user_id ON public.import_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_import_templates_is_public ON public.import_templates(is_public);

-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

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
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour la progression
DROP TRIGGER IF EXISTS update_import_progress_trigger ON public.import_logs;
CREATE TRIGGER update_import_progress_trigger
    AFTER INSERT OR UPDATE ON public.import_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_import_progress();

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
$$ LANGUAGE plpgsql;

-- Trigger pour assigner automatiquement l'ordre de traitement
DROP TRIGGER IF EXISTS assign_import_processing_order_trigger ON public.import_logs;
CREATE TRIGGER assign_import_processing_order_trigger
    BEFORE INSERT ON public.import_logs
    FOR EACH ROW
    EXECUTE FUNCTION assign_import_processing_order();

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur la table import_jobs
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Politiques pour import_jobs
DROP POLICY IF EXISTS "Users can view own import jobs" ON public.import_jobs;
CREATE POLICY "Users can view own import jobs" ON public.import_jobs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own import jobs" ON public.import_jobs;
CREATE POLICY "Users can create own import jobs" ON public.import_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own import jobs" ON public.import_jobs;
CREATE POLICY "Users can update own import jobs" ON public.import_jobs
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own import jobs" ON public.import_jobs;
CREATE POLICY "Users can delete own import jobs" ON public.import_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Activer RLS sur la table import_logs
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour import_logs (basées sur le job parent)
DROP POLICY IF EXISTS "Users can view own import logs" ON public.import_logs;
CREATE POLICY "Users can view own import logs" ON public.import_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.import_jobs 
            WHERE import_jobs.id = import_logs.import_job_id 
            AND import_jobs.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own import logs" ON public.import_logs;
CREATE POLICY "Users can create own import logs" ON public.import_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.import_jobs 
            WHERE import_jobs.id = import_logs.import_job_id 
            AND import_jobs.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own import logs" ON public.import_logs;
CREATE POLICY "Users can update own import logs" ON public.import_logs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.import_jobs 
            WHERE import_jobs.id = import_logs.import_job_id 
            AND import_jobs.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own import logs" ON public.import_logs;
CREATE POLICY "Users can delete own import logs" ON public.import_logs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.import_jobs 
            WHERE import_jobs.id = import_logs.import_job_id 
            AND import_jobs.user_id = auth.uid()
        )
    );

-- Activer RLS sur la table import_templates
ALTER TABLE public.import_templates ENABLE ROW LEVEL SECURITY;

-- Politiques pour import_templates
DROP POLICY IF EXISTS "Users can view own templates" ON public.import_templates;
CREATE POLICY "Users can view own templates" ON public.import_templates
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public templates" ON public.import_templates;
CREATE POLICY "Users can view public templates" ON public.import_templates
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can create own templates" ON public.import_templates;
CREATE POLICY "Users can create own templates" ON public.import_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own templates" ON public.import_templates;
CREATE POLICY "Users can update own templates" ON public.import_templates
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own templates" ON public.import_templates;
CREATE POLICY "Users can delete own templates" ON public.import_templates
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour obtenir les jobs d'import avec les statistiques
CREATE OR REPLACE VIEW public.import_jobs_with_stats AS
SELECT 
    ij.id,
    ij.user_id,
    ij.deck_id,
    ij.file_name,
    ij.file_size,
    ij.file_url,
    ij.import_type,
    ij.status,
    ij.total_words,
    ij.processed_words,
    ij.successful_imports,
    ij.failed_imports,
    ij.generate_audio,
    ij.generate_images,
    ij.error_message,
    ij.progress_percentage,
    ij.started_at,
    ij.completed_at,
    ij.created_at,
    ij.updated_at,
    u.name as user_name,
    u.username as user_username,
    d.title as deck_title
FROM public.import_jobs ij
JOIN public.users u ON ij.user_id = u.id
LEFT JOIN public.decks d ON ij.deck_id = d.id;

-- Vue pour obtenir les logs d'import avec les détails
CREATE OR REPLACE VIEW public.import_logs_with_details AS
SELECT 
    il.*,
    ij.file_name,
    ij.import_type,
    ij.generate_audio,
    ij.generate_images,
    c.front_content,
    c.back_content
FROM public.import_logs il
JOIN public.import_jobs ij ON il.import_job_id = ij.id
LEFT JOIN public.cards c ON il.card_id = c.id;

-- =====================================================
-- DONNÉES DE BASE
-- =====================================================

-- Insérer des templates d'import par défaut
INSERT INTO public.import_templates (name, description, is_public, template_config) VALUES
(
    'Template CSV Standard',
    'Template pour fichiers CSV avec colonnes: français,occitan',
    true,
    '{
        "separator": ",",
        "columns": ["french", "occitan"],
        "has_header": true,
        "encoding": "utf-8"
    }'
),
(
    'Template TXT Simple',
    'Template pour fichiers TXT avec un mot par ligne',
    true,
    '{
        "separator": "\n",
        "columns": ["french"],
        "has_header": false,
        "encoding": "utf-8"
    }'
),
(
    'Template CSV Complet',
    'Template pour fichiers CSV avec prononciation et notes',
    true,
    '{
        "separator": ",",
        "columns": ["french", "occitan", "pronunciation", "notes"],
        "has_header": true,
        "encoding": "utf-8"
    }'
)
ON CONFLICT DO NOTHING; 