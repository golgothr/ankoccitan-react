export type CardType = 'revirada' | 'votz' | 'pexels' | 'manual' | 'cloze';

export interface Card {
  id: string;
  deck_id: string;
  card_type: CardType;
  front_content: string;
  back_content: string;
  pronunciation?: string;
  audio_url?: string;
  image_url?: string;
  api_metadata?: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CardFormData {
  cardType: CardType;
  frontContent: string;
  backContent: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

// Validation intégrée
export const isCardValid = (card: CardFormData): boolean => {
  return (
    card.frontContent.trim().length > 0 && card.backContent.trim().length > 0
  );
};

export const getCardValidationErrors = (card: CardFormData): string[] => {
  const errors: string[] = [];
  if (!card.frontContent.trim()) errors.push('Contenu recto requis');
  if (!card.backContent.trim()) errors.push('Contenu verso requis');
  return errors;
};

// Types pour les APIs externes
export interface TranslationResult {
  text: string;
  confidence?: number;
  source?: string;
}

export interface AudioResult {
  url: string;
  duration?: number;
  format?: string;
}

export interface ImageResult {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

// Types pour les formulaires spécifiques
export interface FrenchToOccitanFormData {
  frenchText: string;
  occitanText: string;
  pronunciation?: string;
  includeAudio: boolean;
  includeImage: boolean;
  imageQuery?: string;
}

export interface ImageToOccitanFormData {
  imageUrl: string;
  imageAlt: string;
  frenchDescription: string;
  occitanTranslation: string;
}

export interface ClozeFormData {
  frenchText: string;
  occitanText: string;
  clozeText: string; // Texte avec les trous
  hints: Record<number, string>; // Indices pour chaque trou
  hiddenWords: number[]; // Positions des mots masqués
}

// Configuration des types de cartes
export interface CardTypeDefinition {
  id: CardType;
  label: string;
  description: string;
  supportsAudio?: boolean;
  supportsImage?: boolean;
  requiresTranslation?: boolean;
  icon?: string; // Nom de l'icône (à implémenter plus tard)
}

export const CARD_TYPES: Record<CardType, CardTypeDefinition> = {
  revirada: {
    id: 'revirada',
    label: 'Français → Occitan',
    description: "Traduire du français vers l'occitan",
    supportsAudio: true,
    supportsImage: true,
    requiresTranslation: true,
    icon: 'translate',
  },
  votz: {
    id: 'votz',
    label: 'Audio → Occitan',
    description: 'Créer des cartes avec audio',
    supportsAudio: true,
    supportsImage: false,
    requiresTranslation: false,
    icon: 'mic',
  },
  pexels: {
    id: 'pexels',
    label: 'Image → Occitan',
    description: 'Créer des cartes avec images',
    supportsAudio: false,
    supportsImage: true,
    requiresTranslation: true,
    icon: 'image',
  },
  manual: {
    id: 'manual',
    label: 'Manuel',
    description: 'Créer des cartes manuellement',
    supportsAudio: false,
    supportsImage: false,
    requiresTranslation: false,
    icon: 'edit',
  },
  cloze: {
    id: 'cloze',
    label: 'Texte à trous',
    description: 'Créer des cartes avec du texte et des mots masqués',
    supportsAudio: false,
    supportsImage: false,
    requiresTranslation: true,
    icon: 'text',
  },
} as const;
