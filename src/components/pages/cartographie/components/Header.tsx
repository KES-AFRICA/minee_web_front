import React, { useState } from 'react';
import { Search, Filter, Square, X, TrendingUp } from 'lucide-react';
import {useMapStore} from "@/store/mapStore.ts";

const Header: React.FC = () => {
  const {
    filters,
    drawingMode,
    selectedElements,
    setFilters,
    setDrawingMode,
    clearSelection
  } = useMapStore();

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const elementTypes = [
    { value: 'restaurantgfdgdf', label: 'Restaurantsgdffd', color: 'bg-red-500', icon: '🍽️' },
    { value: 'hotel', label: 'Hotels', color: 'bg-blue-500', icon: '🏨' },
    { value: 'attraction', label: 'Attractions', color: 'bg-green-500', icon: '🎯' },
    { value: 'shop', label: 'Shops', color: 'bg-purple-500', icon: '🛍️' }
  ];

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ types: newTypes });
  };

  const getTotalValue = () => {
    return selectedElements.reduce((total, element) => total + element.anneeMiseEnService, 0);
  };

  const getAverageRating = () => {
    if (selectedElements.length === 0) return 0;
    const total = selectedElements.reduce((sum, element) => sum + element.anneeMiseEnService, 0);
    return total / selectedElements.length;
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w mx-auto">
        {/* Top row - Title and main controls */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">

          </div>

          <div className="flex items-center space-x-3">
            {selectedElements.length > 0 && (
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-800">
                    {selectedElements.length} sélectionné{selectedElements.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-px h-6 bg-green-300"></div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-800">{getTotalValue()}€</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-green-800">{getAverageRating().toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setDrawingMode(!drawingMode)}
              className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                drawingMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-lg'
              }`}
            >
              <Square className={`h-5 w-5 transition-transform duration-300 ${drawingMode ? 'rotate-45' : ''}`} />
              <span className="text-sm font-semibold">
                {drawingMode ? 'Mode Sélection ON' : 'Mode Sélection'}
              </span>
              {drawingMode && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>

            <button
              onClick={clearSelection}
              className="group flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span className="text-sm font-semibold">Effacer</span>
            </button>
          </div>
        </div>

        {/* Second row - Filters */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Search */}
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Rechercher un lieu, restaurant, hôtel..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg placeholder-gray-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ searchQuery: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Type filters */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtres</span>
              </button>
              
              <div className="flex space-x-2">
                {elementTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      filters.types.includes(type.value)
                        ? `${type.color} text-white shadow-xl`
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
                    }`}
                  >
                    <span className="text-base">{type.icon}</span>
                    <span>{type.label}</span>
                    {filters.types.includes(type.value) && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expanded filters */}
          <div className={`mt-4 transition-all duration-500 ease-in-out overflow-hidden ${
            isFilterExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex items-center justify-center space-x-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
              {/* Price filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-700">Prix maximum:</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ 
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                    })}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="px-3 py-1 bg-white rounded-lg shadow-md border border-gray-200">
                    <span className="text-sm font-bold text-gray-900">{filters.priceRange[1]}€</span>
                  </div>
                </div>
              </div>

              {/* Rating filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-700">Note minimum:</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.ratingMin}
                    onChange={(e) => setFilters({ ratingMin: parseFloat(e.target.value) })}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="px-3 py-1 bg-white rounded-lg shadow-md border border-gray-200">
                    <span className="text-sm font-bold text-gray-900">{filters.ratingMin.toFixed(1)}⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;