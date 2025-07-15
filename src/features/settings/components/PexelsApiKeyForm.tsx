import React, { useState, useEffect, useCallback } from 'react';
import { settingsApi, ApiKey } from '../../../core/api/settingsApi';
import { pexelsApi } from '../../../core/api/pexelsApi';
import { logger } from '@/core/utils/logger';

interface PexelsApiKeyFormProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const PexelsApiKeyForm: React.FC<PexelsApiKeyFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const loadCurrentApiKey = useCallback(async () => {
    try {
      setIsLoading(true);
      const key = await settingsApi.getApiKey('pexels');
      setCurrentApiKey(key);
      if (key) {
        setApiKey(key.api_key);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement de la clé API:', error);
      onError?.('Erreur lors du chargement de la clé API');
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Charger la clé API existante au montage du composant
  useEffect(() => {
    loadCurrentApiKey();
  }, [loadCurrentApiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      onError?.('Veuillez saisir une clé API');
      return;
    }

    try {
      setIsLoading(true);
      await settingsApi.upsertApiKey('pexels', apiKey.trim());
      await loadCurrentApiKey(); // Recharger pour avoir les données mises à jour
      setIsEditing(false);
      setShowApiKey(false);
      onSuccess?.(
        currentApiKey
          ? 'Clé API mise à jour avec succès'
          : 'Clé API ajoutée avec succès'
      );
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde:', error);
      onError?.('Erreur lors de la sauvegarde de la clé API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentApiKey) return;

    if (
      !window.confirm(
        'Êtes-vous sûr de vouloir supprimer votre clé API Pexels ?'
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await settingsApi.deleteApiKey('pexels');
      setCurrentApiKey(null);
      setApiKey('');
      setIsEditing(false);
      setShowApiKey(false);
      onSuccess?.('Clé API supprimée avec succès');
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error);
      onError?.('Erreur lors de la suppression de la clé API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowApiKey(true);
    // S'assurer que la clé complète est affichée dans le champ
    if (currentApiKey) {
      setApiKey(currentApiKey.api_key);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowApiKey(false);
    if (currentApiKey) {
      setApiKey(currentApiKey.api_key);
    } else {
      setApiKey('');
    }
  };

  const handleTestApiKey = async () => {
    if (!currentApiKey) return;

    try {
      setIsLoading(true);
      const isValid = await pexelsApi.testApiKey();
      if (isValid) {
        onSuccess?.('Clé API Pexels valide !');
      } else {
        onError?.('Clé API Pexels invalide ou erreur de connexion');
      }
    } catch (error) {
      logger.error('Erreur lors du test de la clé API:', error);
      onError?.('Erreur lors du test de la clé API');
    } finally {
      setIsLoading(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return (
      key.substring(0, 4) +
      '*'.repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
  };

  const loadingIndicator =
    isLoading && !currentApiKey ? (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    ) : null;

  return (
    <div className="bg-white border rounded-lg p-6">
      {loadingIndicator}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Clé API Pexels</h3>
        <div className="flex items-center space-x-2">
          {currentApiKey && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
      {currentApiKey && !isEditing && (
        <p className="mb-4 text-sm text-gray-500">
          Une clé est déjà enregistrée. Cliquez sur{' '}
          <span className="font-medium">Modifier</span> pour la mettre à jour.
        </p>
      )}

      {currentApiKey && !isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
            <span className="text-sm text-gray-600">Clé API:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">
                {showApiKey
                  ? currentApiKey.api_key
                  : maskApiKey(currentApiKey.api_key)}
              </span>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showApiKey ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
            <span className="text-sm text-gray-600">Statut:</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                currentApiKey.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentApiKey.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {currentApiKey.last_used_at && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <span className="text-sm text-gray-600">
                Dernière utilisation:
              </span>
              <span className="text-sm text-gray-600">
                {new Date(currentApiKey.last_used_at).toLocaleDateString(
                  'fr-FR'
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
            <span className="text-sm text-gray-600">Utilisations:</span>
            <span className="text-sm text-gray-600">
              {currentApiKey.usage_count}
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pexels-api-key"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Clé API Pexels
            </label>
            <input
              id="pexels-api-key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API Pexels"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Obtenez votre clé API gratuite sur{' '}
                <a
                  href="https://www.pexels.com/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  pexels.com/api
                </a>
              </p>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showApiKey ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? 'Sauvegarde...'
                : currentApiKey
                  ? 'Mettre à jour'
                  : 'Ajouter'}
            </button>
            {currentApiKey && !isEditing && (
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Test...' : 'Tester'}
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
