import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi, LoginCredentials } from '@/core/api';
import { useAuth } from '@/core/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mutation pour la connexion
  const loginMutation = useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
      console.log('[LoginForm] Connexion réussie', data);
      login(data);
      setErrors({});
      setIsSubmitting(false);
      console.log('[LoginForm] Redirection vers /dashboard');
      navigate('/dashboard');
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('[LoginForm] Erreur de connexion', error);
      setErrors({ general: error.message });
      setIsSubmitting(false);
      onError?.(error.message);
    },
  });

  // Validation des champs
  const validateField = (
    name: keyof FormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return "L'email est requis";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Format d'email invalide";
        }
        break;
      case 'password':
        if (!value) return 'Le mot de passe est requis';
        if (value.length < 6) {
          return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        break;
    }
    return undefined;
  };

  // Gestion des changements de champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Valider le champ en temps réel
    const fieldError = validateField(name as keyof FormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
      general: undefined, // Effacer l'erreur générale
    }));
  };

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation complète
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(
        key as keyof FormData,
        formData[key as keyof FormData]
      );
      if (fieldError) {
        newErrors[key as keyof FormData] = fieldError;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Soumettre le formulaire
    loginMutation.mutate(formData as LoginCredentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
          ${
            isSubmitting
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
            Connexion en cours...
          </>
        ) : (
          'Se connecter'
        )}
      </button>

      {isSubmitting && (
        <div id="submitting-status" className="sr-only">
          Connexion en cours...
        </div>
      )}
    </form>
  );
};
