import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { useAuth } from './core/hooks/useAuth';

const HomePage = lazy(() => import('./features/home/HomePage'));
const AuthPage = lazy(() => import('./features/auth/AuthPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const DecksPage = lazy(() => import('./features/decks/DecksPage'));
const CardCreationPage = lazy(
  () => import('./features/decks/pages/CardCreationPage')
);
const ImportPage = lazy(() => import('./features/import/ImportPage'));
const TermsPage = lazy(() => import('./features/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./features/legal/PrivacyPage'));
const NotFoundPage = lazy(() => import('./features/common/NotFoundPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/auth',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/decks',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DecksPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/cards',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CardCreationPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/import',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ImportPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: '/privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}
