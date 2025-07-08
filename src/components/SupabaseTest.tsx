import React, { useState, useEffect } from 'react';
import { supabase } from '@/core/lib/supabase';

export const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Vérification...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSupabaseConfig();
  }, []);

  const checkSupabaseConfig = async () => {
    try {
      setStatus('Vérification de la configuration...');
      
      // Vérifier les variables d'environnement
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        throw new Error('Variables d\'environnement Supabase manquantes');
      }
      
      setStatus('Test de connexion à Supabase...');
      
      // Test de connexion simple
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        throw new Error(`Erreur de connexion: ${error.message}`);
      }
      
      setStatus('✅ Configuration Supabase OK');
      setError(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setStatus('❌ Configuration Supabase échouée');
      setError(errorMessage);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Test Configuration Supabase</h3>
      <p className="text-sm">{status}</p>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-xs mt-1">
            Créez un fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
          </p>
        </div>
      )}
    </div>
  );
}; 