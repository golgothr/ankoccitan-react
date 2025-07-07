import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser, RegisterData } from '../../../core/api/authApi';
import { useAuth } from '@/core/hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  // Mutation pour l'inscription
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Utiliser le hook centralisé pour la connexion
      login(data);
      
      setErrors({});
      setIsSubmitting(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setErrors({ general: error.message });
      setIsSubmitting(false);
      onError?.(error.message);
    },
  });

  // Validation des champs
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value) return 'Le nom est requis';
        if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        break;
      case 'username':
        if (!value) return 'Le pseudonyme est requis';
        if (value.length < 3) return 'Le pseudonyme doit contenir au moins 3 caractères';
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return 'Le pseudonyme ne peut contenir que des lettres, chiffres, tirets et underscores';
        }
        break;
      case 'email':
        if (!value) return 'L\'email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format d\'email invalide';
        }
        break;
      case 'password':
        if (!value) return 'Le mot de passe est requis';
        if (value.length < 6) {
          return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        break;
      case 'confirmPassword':
        if (!value) return 'La confirmation du mot de passe est requise';
        if (value !== formData.password) {
          return 'Les mots de passe ne correspondent pas';
        }
        break;
    }
    return undefined;
  };

  // Gestion des changements de champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Valider le champ en temps réel
    const fieldError = validateField(name as keyof FormData, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
      general: undefined, // Effacer l'erreur générale
    }));

    // Re-valider la confirmation du mot de passe si le mot de passe change
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation complète
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (fieldError) {
        newErrors[key as keyof FormData] = fieldError;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Préparer les données pour l'API
    const userData: RegisterData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Soumettre le formulaire
    registerMutation.mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange transition-colors duration-200 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Votre nom complet"
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Pseudonyme
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange transition-colors duration-200 ${
            errors.username ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Votre pseudonyme"
          required
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <p id="username-error" className="mt-1 text-sm text-red-600">
            {errors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange transition-colors duration-200 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="votre@email.com"
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange transition-colors duration-200 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Votre mot de passe"
          required
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange transition-colors duration-200 ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Confirmez votre mot de passe"
          required
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full flex justify-center py-3 px-4 
          border border-transparent rounded-lg shadow-lg 
          text-sm font-semibold text-white 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange 
          transition-all duration-300 transform hover:scale-105
          ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-occitan-red to-occitan-orange hover:from-occitan-orange hover:to-occitan-red'
          }
        `}
        aria-describedby={isSubmitting ? 'submitting-status' : undefined}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Création en cours...
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>

      {isSubmitting && (
        <div id="submitting-status" className="sr-only">
          Création de compte en cours...
        </div>
      )}
    </form>
  );
}; 