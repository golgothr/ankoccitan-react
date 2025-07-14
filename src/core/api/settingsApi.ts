import { supabase } from '../lib/supabase';

export interface ApiKey {
  id: string;
  user_id: string;
  service_name: 'revirada' | 'votz' | 'pexels';
  api_key: string;
  api_secret?: string;
  is_active: boolean;
  last_used_at?: string;
  usage_count: number;
  rate_limit_remaining?: number;
  rate_limit_reset_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyData {
  service_name: 'revirada' | 'votz' | 'pexels';
  api_key: string;
  api_secret?: string;
}

export interface UpdateApiKeyData {
  api_key?: string;
  api_secret?: string;
  is_active?: boolean;
}

export const settingsApi = {
  // Récupérer toutes les clés API de l'utilisateur
  async getUserApiKeys(): Promise<ApiKey[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer une clé API spécifique
  async getApiKey(
    serviceName: 'revirada' | 'votz' | 'pexels'
  ): Promise<ApiKey | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', serviceName)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Créer ou mettre à jour une clé API
  async upsertApiKey(
    serviceName: 'revirada' | 'votz' | 'pexels',
    apiKey: string,
    apiSecret?: string
  ): Promise<ApiKey> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('user_api_keys')
      .upsert(
        {
          user_id: user.id,
          service_name: serviceName,
          api_key: apiKey,
          api_secret: apiSecret,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,service_name',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une clé API
  async deleteApiKey(
    serviceName: 'revirada' | 'votz' | 'pexels'
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('service_name', serviceName);

    if (error) throw error;
  },

  // Désactiver une clé API
  async deactivateApiKey(
    serviceName: 'revirada' | 'votz' | 'pexels'
  ): Promise<ApiKey> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('user_api_keys')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('service_name', serviceName)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
