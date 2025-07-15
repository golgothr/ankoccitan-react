import { useCallback, memo } from 'react';
import {
  DeckFilters as Filters,
  DECK_CATEGORIES,
  SUGGESTED_TAGS,
} from '../types/deck.types';

interface DeckFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
}

export const DeckFilters = memo(
  ({ filters, onFiltersChange }: DeckFiltersProps) => {
    const handleSearchChange = useCallback(
      (value: string) => {
        onFiltersChange({ search: value });
      },
      [onFiltersChange]
    );

    const handleCategoryChange = useCallback(
      (category: Filters['category']) => {
        onFiltersChange({ category });
      },
      [onFiltersChange]
    );

    const handleTagToggle = useCallback(
      (tag: string) => {
        const newTags = filters.tags.includes(tag)
          ? filters.tags.filter((t) => t !== tag)
          : [...filters.tags, tag];
        onFiltersChange({ tags: newTags });
      },
      [filters.tags, onFiltersChange]
    );

    const handleSortChange = useCallback(
      (sortBy: Filters['sortBy']) => {
        onFiltersChange({ sortBy });
      },
      [onFiltersChange]
    );

    const handleSortOrderChange = useCallback(() => {
      onFiltersChange({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    }, [filters.sortOrder, onFiltersChange]);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 mb-6">
        {/* Recherche */}
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rechercher un deck
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            </div>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-occitan-orange focus:border-occitan-orange"
              placeholder="Nom du deck..."
            />
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.category === 'all'
                  ? 'bg-occitan-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            {Object.entries(DECK_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as Filters['category'])}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.category === key
                    ? 'bg-occitan-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres par tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.tags.includes(tag)
                    ? 'bg-occitan-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Tri */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Trier par :
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as Filters['sortBy'])
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-occitan-orange focus:border-occitan-orange"
            >
              <option value="name">Nom</option>
              <option value="cardCount">Nombre de cartes</option>
              <option value="lastModified">Dernière modification</option>
              <option value="createdAt">Date de création</option>
            </select>

            <button
              onClick={handleSortOrderChange}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {filters.sortOrder === 'asc' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Réinitialiser les filtres */}
          {(filters.search ||
            filters.category !== 'all' ||
            filters.tags.length > 0) && (
            <button
              onClick={() =>
                onFiltersChange({ search: '', category: 'all', tags: [] })
              }
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>
    );
  }
);
