import { useState, memo, useCallback, useMemo } from 'react';
import { ImageSearchModal } from './ImageSearchModal';
import { PexelsImage } from '../../../core/api/pexelsApi';

interface ImageSearchButtonProps {
  onImageSelected: (image: PexelsImage) => void;
  placeholder?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ImageSearchButton = memo(
  ({
    onImageSelected,
    placeholder = 'Rechercher une image...',
    className = '',
    variant = 'primary',
    size = 'md',
  }: ImageSearchButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageSelected = useCallback(
      (image: PexelsImage) => {
        onImageSelected(image);
        setIsModalOpen(false);
      },
      [onImageSelected]
    );

    const buttonClasses = useMemo(() => {
      const baseClasses =
        'inline-flex items-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

      const variantClasses = {
        primary:
          'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
        secondary:
          'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
        outline:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
      };

      const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      };

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    }, [variant, size, className]);

    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={buttonClasses}
          aria-label="Ouvrir la recherche d'image"
        >
          <svg
            className={`${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} mr-2`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {placeholder}
        </button>

        <ImageSearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectImage={handleImageSelected}
        />
      </>
    );
  }
);
