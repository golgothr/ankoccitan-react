import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/features/home/HomePage'
import { DashboardPage } from '@/features/decks/HomePage'
import { AuthPage } from '@/features/auth/AuthPage'
import { UserProfilePage } from '@/features/users/UserProfilePage'

// Root route avec layout
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Routes principales
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: UserProfilePage,
})

// Configuration du routeur
const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, authRoute, profileRoute])

export const router = createRouter({ routeTree })

// Types pour TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 