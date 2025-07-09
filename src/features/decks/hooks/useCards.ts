import { useState } from 'react';
import { CardFormData, Card, isCardValid } from '../types/card.types';

// À remplacer par ton vrai client/API Supabase
async function saveCardToSupabase(
  card: CardFormData,
  deckId: string
): Promise<Card> {
  // Simule un appel API
  return {
    id: Math.random().toString(36).slice(2),
    deck_id: deckId,
    card_type: card.cardType,
    front_content: card.frontContent,
    back_content: card.backContent,
    pronunciation: card.pronunciation,
    audio_url: card.audioUrl,
    image_url: card.imageUrl,
    api_metadata: card.metadata,
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

type SaveMode = 'immediate' | 'batch';

export function useCards(deckId?: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [pendingCards, setPendingCards] = useState<CardFormData[]>([]);
  const [saveMode, setSaveMode] = useState<SaveMode>('batch');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ajoute une carte (immédiatement ou en buffer)
  const addCard = async (cardData: CardFormData) => {
    if (!isCardValid(cardData)) {
      throw new Error('Carte invalide (recto/verso requis)');
    }
    setError(null);

    if (saveMode === 'immediate') {
      if (!deckId) throw new Error('Aucun deck sélectionné');
      setLoading(true);
      try {
        const saved = await saveCardToSupabase(cardData, deckId);
        setCards((prev) => [saved, ...prev]);
        return saved;
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : 'Erreur lors de la sauvegarde';
        setError(errorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      setPendingCards((prev) => [...prev, cardData]);
      return cardData;
    }
  };

  // Sauvegarde toutes les cartes en attente (batch)
  const saveAllPending = async () => {
    if (!deckId) throw new Error('Aucun deck sélectionné');
    setLoading(true);
    setError(null);
    try {
      const results: Card[] = [];
      for (const card of pendingCards) {
        const saved = await saveCardToSupabase(card, deckId);
        results.push(saved);
      }
      setCards((prev) => [...results, ...prev]);
      setPendingCards([]);
      return results;
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'Erreur lors de la sauvegarde groupée';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Pour charger les cartes d’un deck (à adapter selon ton API)
  const getCards = async () => {
    // TODO: Intégrer l’appel réel à Supabase
    return cards;
  };

  return {
    cards,
    pendingCards,
    saveMode,
    setSaveMode,
    loading,
    error,
    addCard,
    saveAllPending,
    getCards,
    setCards, // Utile pour initialiser depuis l’API réelle
    setPendingCards,
  };
}
