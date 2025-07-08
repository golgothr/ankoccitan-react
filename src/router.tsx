import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { HomePage } from '@/features/home/HomePage'
import { AuthPage } from '@/features/auth/AuthPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { TermsPage } from '@/features/legal/TermsPage'
import { PrivacyPage } from '@/features/legal/PrivacyPage'
import { ProtectedRoute } from '@/core/components/ProtectedRoute'

// Route racine simplifiée
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  ),
})

// Routes principales
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

// Route dashboard protégée
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
})

// Routes légales
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
})

// Configuration du routeur
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  dashboardRoute,
  termsRoute,
  privacyRoute,
])

export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
})

// Types pour TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 