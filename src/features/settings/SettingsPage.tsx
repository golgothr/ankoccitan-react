import React, { useState } from 'react';
import { PexelsApiKeyForm } from './components/PexelsApiKeyForm';
import { Toast } from './components/Toast';

export const SettingsPage: React.FC = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">
          Gérez vos préférences et clés API pour personnaliser votre expérience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section Clés API */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Clés API
            </h2>
            <p className="text-gray-600">
              Configurez vos clés API pour activer les fonctionnalités avancées
              comme la recherche d'images.
            </p>
          </div>

          <div className="space-y-6">
            <PexelsApiKeyForm
              onSuccess={(message) => showToast(message, 'success')}
              onError={(message) => showToast(message, 'error')}
            />

            {/* Placeholder pour d'autres services API */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Autres services
                </h3>
                <span className="text-sm text-gray-500">
                  Bientôt disponible
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                D'autres services API seront bientôt disponibles pour enrichir
                vos cartes.
              </p>
            </div>
          </div>
        </section>

        {/* Section Préférences utilisateur */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Préférences
            </h2>
            <p className="text-gray-600">
              Personnalisez votre expérience d'apprentissage.
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6">
            <p className="text-gray-500 text-sm">
              Les préférences utilisateur seront bientôt disponibles.
            </p>
          </div>
        </section>
      </div>

      {/* Toast pour les notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};
