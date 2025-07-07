import { Outlet, Link, useRouter } from '@tanstack/react-router'

export function RootLayout() {
  const router = useRouter();
  const isHome = router.state.location.pathname === '/';

  return (
    <div className="min-h-screen">
      {!isHome && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  Ankòccitan
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Accueil
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  )
} 