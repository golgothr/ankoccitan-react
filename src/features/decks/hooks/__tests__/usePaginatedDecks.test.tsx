import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePaginatedDecks } from '../usePaginatedDecks';
import { fetchUserDecksPage } from '../../../../core/api/supabaseDecksApi';

vi.mock('../../../../core/api/supabaseDecksApi', () => ({
  fetchUserDecksPage: vi.fn(),
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('usePaginatedDecks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads pages sequentially', async () => {
    vi.mocked(fetchUserDecksPage).mockResolvedValueOnce({
      data: [
        {
          id: '1',
          title: 'Deck 1',
          description: '',
          difficulty_level: 'débutant',
          tags: [],
          is_public: true,
          card_count: 0,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          user_id: '1',
        },
      ],
      total: 2,
    });
    vi.mocked(fetchUserDecksPage).mockResolvedValueOnce({
      data: [
        {
          id: '2',
          title: 'Deck 2',
          description: '',
          difficulty_level: 'débutant',
          tags: [],
          is_public: true,
          card_count: 0,
          created_at: '2024-01-02',
          updated_at: '2024-01-02',
          user_id: '1',
        },
      ],
      total: 2,
    });

    const { result } = renderHook(() => usePaginatedDecks(1), { wrapper });

    await waitFor(() => !result.current.loading);
    expect(result.current.decks[0].name).toBe('Deck 1');

    result.current.nextPage();
    await waitFor(() =>
      result.current.page === 2 &&
      !result.current.loading &&
      result.current.decks[0]?.name === 'Deck 2'
    );

    expect(fetchUserDecksPage).toHaveBeenCalledWith(1, 1);
    expect(fetchUserDecksPage).toHaveBeenCalledWith(2, 1);
  });
});
