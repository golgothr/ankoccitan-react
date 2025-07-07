import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock des modules si nécessaire
vi.mock('@tanstack/react-router', () => ({
  createRouter: vi.fn(),
  RouterProvider: vi.fn(),
}))

// Configuration globale pour les tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) 