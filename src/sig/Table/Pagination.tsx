import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

const Pagination: React.FC = () => {
  const {
    filteredActifs,
    currentPage,
    itemsPerPage,
    setPage,
    setItemsPerPage
  } = useAppStore();

  const totalItems = filteredActifs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si peu de pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {/* Informations sur les résultats */}
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Affichage de {startItem} à {endItem} sur {totalItems} résultats
          </span>
          
          {/* Sélecteur du nombre d'éléments par page */}
          <div className="ml-4 flex items-center">
            <label className="mr-2 text-sm text-gray-600">
              Éléments par page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Contrôles de pagination */}
        <div className="flex items-center space-x-2">
          {/* Bouton précédent */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </button>

          {/* Numéros de page */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
                disabled={typeof page === 'string'}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${typeof page === 'string'
                    ? 'text-gray-400 cursor-default'
                    : page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;