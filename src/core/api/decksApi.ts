export interface Deck {
  id: string
  title: string
  description: string
  cardCount: number
  createdAt: string
}

// Mock data pour l'exemple
const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'Vocabulaire Occitan',
    description: 'Apprenez les mots de base en occitan',
    cardCount: 50,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Grammaire Occitane',
    description: 'Règles grammaticales essentielles',
    cardCount: 30,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Expressions Courantes',
    description: 'Phrases utiles pour la conversation',
    cardCount: 25,
    createdAt: '2024-01-03',
  },
]

export async function fetchDecks(): Promise<Deck[]> {
  // Simulation d'un appel API
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockDecks
}

export async function createDeck(deck: Omit<Deck, 'id' | 'createdAt'>): Promise<Deck> {
  const newDeck: Deck = {
    ...deck,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  return newDeck
} 