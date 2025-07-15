import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock des modules si nécessaire
vi.mock('@tanstack/react-router', () => ({
  createRouter: vi.fn(),
  RouterProvider: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router-dom') as any
  return {
    ...actual,
    Link: (props: any) => React.createElement('a', props),
  }
})

// Configuration globale pour les tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) 