import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { DashboardPage } from '@/features/decks/HomePage'

// Wrapper pour les tests avec providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('HomePage Integration', () => {
  it('should render the welcome message', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Bienvenue sur AnkoCitan')).toBeInTheDocument()
    })
  })

  it('should display loading state initially', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should display decks after loading', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getAllByTestId('deck-card')).toHaveLength(3)
    })
  })
}) 