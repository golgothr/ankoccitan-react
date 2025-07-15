import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court')
});

export const DeckSchema = z.object({
  title: z.string().min(3, 'Titre trop court'),
  description: z.string().min(10, 'Description trop courte'),
  difficulty_level: z.enum(['débutant', 'intermédiaire', 'avancé'])
});
