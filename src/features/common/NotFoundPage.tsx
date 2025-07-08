import React from 'react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-occitan-red mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">Page non trouvée</p>
      <a href="/" className="text-occitan-orange underline hover:text-occitan-red">Retour à l'accueil</a>
    </div>
  );
} 