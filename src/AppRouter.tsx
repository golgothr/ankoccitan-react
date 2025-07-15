import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
const HomePage = React.lazy(() => import('./features/home/HomePage'));
const AuthPage = React.lazy(() => import('./features/auth/AuthPage'));
const DashboardPage = React.lazy(
  () => import('./features/dashboard/DashboardPage')
);
const DecksPage = React.lazy(() => import('./features/decks/DecksPage'));
const CardCreationPage = React.lazy(
  () => import('./features/decks/pages/CardCreationPage')
);
const ImportPage = React.lazy(() => import('./features/import/ImportPage'));
const TermsPage = React.lazy(() => import('./features/legal/TermsPage'));
const PrivacyPage = React.lazy(() => import('./features/legal/PrivacyPage'));
const NotFoundPage = React.lazy(() => import('./features/common/NotFoundPage'));
import { useAuth } from './core/hooks/useAuth';
import { AppLayout } from './AppLayout';
import { SettingsPage } from './features/settings/SettingsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    console.log(
      '[RequireAuth] Utilisateur non connecté, redirection vers /auth'
    );
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/decks"
              element={
                <RequireAuth>
                  <DecksPage />
                </RequireAuth>
              }
            />
            <Route
              path="/cards"
              element={
                <RequireAuth>
                  <CardCreationPage />
                </RequireAuth>
              }
            />
            <Route
              path="/import"
              element={
                <RequireAuth>
                  <ImportPage />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
