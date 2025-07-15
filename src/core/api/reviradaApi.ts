import { settingsApi } from './settingsApi';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';
import { env } from '@/core/config/env';

export interface ReviradaTranslation {
  text: string;
  confidence?: number;
}

async function recordUsage(
  userId: string,
  apiKeyId: string,
  success: boolean,
  responseTime: number
) {
  try {
    const { error } = await supabase.rpc('update_api_usage_stats', {
      p_user_id: userId,
      p_service_name: 'revirada',
      p_api_key_id: apiKeyId,
      p_success: success,
      p_response_time_ms: responseTime,
    });
    if (error) {
      logger.error('Erreur lors de la mise à jour des stats Revirada:', error);
    }
  } catch (err) {
    logger.error('Erreur RPC update_api_usage_stats:', err);
  }
}

export const reviradaApi = {
  async translate(text: string): Promise<ReviradaTranslation> {
    const apiKey = await settingsApi.getApiKey('revirada');
    if (!apiKey || !apiKey.is_active) {
      throw new Error('Clé API Revirada non configurée ou inactive');
    }

    const start = Date.now();
    let success = false;
    try {
      const response = await fetch(`${env.REVIARDA_API_URL}/translate`, {
        method: 'POST',
        headers: {
          Authorization: apiKey.api_key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Erreur Revirada: ${response.status}`);
      }

      const data = (await response.json()) as ReviradaTranslation;
      success = true;
      return data;
    } catch (error) {
      logger.error('Erreur lors de la traduction Revirada:', error);
      throw error;
    } finally {
      await recordUsage(apiKey.user_id, apiKey.id, success, Date.now() - start);
    }
  },
};
