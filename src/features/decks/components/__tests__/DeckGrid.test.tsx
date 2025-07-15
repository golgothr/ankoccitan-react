import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeckGrid } from '../DeckGrid';
import { Deck } from '../../types/deck.types';

const createDeck = (id: number): Deck => ({
  id: String(id),
  name: `Deck ${id}`,
  description: '',
  cardCount: 0,
  category: 'vocabulary',
  tags: [],
  lastModified: new Date(),
  isPublic: true,
  createdAt: new Date(),
  userId: '1',
});

describe('DeckGrid', () => {
  it('uses virtualization for large lists', () => {
    const decks = Array.from({ length: 60 }, (_, i) => createDeck(i));
    render(
      <DeckGrid
        decks={decks}
        onEdit={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });
});
