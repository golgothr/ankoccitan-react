import { useNavigate } from 'react-router-dom';

export function ImportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-occitan-orange/10 via-white to-occitan-red/10">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-colors duration-200"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour au Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Import en masse
            </h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-md border border-gray-100">
          <p className="text-gray-700">
            Cette fonctionnalité permettra d'importer des cartes à partir d'un
            fichier CSV ou TXT. Elle est en cours de développement.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImportPage;
