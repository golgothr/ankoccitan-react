import { settingsApi } from './settingsApi';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';
import { env } from '@/core/config/env';

export interface VotzAudio {
  url: string;
  duration?: number;
  format?: string;
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
      p_service_name: 'votz',
      p_api_key_id: apiKeyId,
      p_success: success,
      p_response_time_ms: responseTime,
    });
    if (error) {
      logger.error('Erreur lors de la mise à jour des stats VOTZ:', error);
    }
  } catch (err) {
    logger.error('Erreur RPC update_api_usage_stats:', err);
  }
}

export const votzApi = {
  async textToSpeech(text: string): Promise<VotzAudio> {
    const apiKey = await settingsApi.getApiKey('votz');
    if (!apiKey || !apiKey.is_active) {
      throw new Error('Clé API VOTZ non configurée ou inactive');
    }

    const start = Date.now();
    let success = false;
    try {
      const response = await fetch(`${env.VOTZ_API_URL}/tts`, {
        method: 'POST',
        headers: {
          Authorization: apiKey.api_key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Erreur VOTZ: ${response.status}`);
      }

      const data = (await response.json()) as VotzAudio;
      success = true;
      return data;
    } catch (error) {
      logger.error('Erreur lors de la synthèse vocale VOTZ:', error);
      throw error;
    } finally {
      await recordUsage(apiKey.user_id, apiKey.id, success, Date.now() - start);
    }
  },
};
