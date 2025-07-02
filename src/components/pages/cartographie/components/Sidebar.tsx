import React, { useState } from 'react';
import { X, Star, MapPin, ExternalLink, Download, Share2, Heart, Eye, Navigation, Clock } from 'lucide-react';
import ExportModal from './ExportModal';
import {useMapStore} from "@/store/mapStore.ts";

const Sidebar: React.FC = () => {
  const { selectedElements, sidebarOpen, setSidebarOpen, clearSelection } = useMapStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  if (!sidebarOpen || selectedElements.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    const colors = {
      restaurant: 'bg-red-100 text-red-800 border-red-200',
      hotel: 'bg-blue-100 text-blue-800 border-blue-200',
      attraction: 'bg-green-100 text-green-800 border-green-200',
      shop: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      restaurant: '🍽️',
      hotel: '🏨',
      attraction: '🎯',
      shop: '🛍️'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      restaurant: 'Restaurant',
      hotel: 'Hôtel',
      attraction: 'Attraction',
      shop: 'Boutique'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTotalValue = () => {
    return selectedElements.reduce((total, element) => total + element.anneeMiseEnService, 0);
  };

  const getAverageRating = () => {
    const total = selectedElements.reduce((sum, element) => sum + element.anneeMiseEnService, 0);
    return (total / selectedElements.length).toFixed(1);
  };

  const toggleLike = (elementId: string) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(elementId)) {
      newLikedItems.delete(elementId);
    } else {
      newLikedItems.add(elementId);
    }
    setLikedItems(newLikedItems);
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-500 ease-out border-l border-gray-200/50 animate-slide-in-right ">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Sélection active
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{selectedElements.length} élément{selectedElements.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{getAverageRating()}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="font-bold text-green-600">{getTotalValue()}€</span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="group p-2 hover:bg-white/50 rounded-xl transition-all duration-200 transform hover:scale-110"
              >
                <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                <div className="text-xs text-gray-600 font-medium">Valeur totale</div>
                <div className="text-lg font-bold text-green-600">{getTotalValue()}€</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                <div className="text-xs text-gray-600 font-medium">Note moyenne</div>
                <div className="text-lg font-bold text-yellow-600">{getAverageRating()}⭐</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                <div className="text-xs text-gray-600 font-medium">Éléments</div>
                <div className="text-lg font-bold text-blue-600">{selectedElements.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200/50 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportModalOpen(true)}
              className="group flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Exporter</span>
            </button>
            <button className="group flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Partager</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 custom-scrollbar overflow-scroll">
          {selectedElements.map((element, index) => (
            <div
              key={element.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-200/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Overlays */}
                <div className="absolute top-3 left-3">
                  <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(element.type)}`}>
                    <span>{getTypeIcon(element.type)}</span>
                    <span>{getTypeLabel(element.type)}</span>
                  </span>
                </div>
                
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => toggleLike(element.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                      likedItems.has(element.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedItems.has(element.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                    <span className="text-sm font-bold text-green-600">{element.anneeMiseEnService}€</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-lg text-white drop-shadow-lg">{element.designationGenerale}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{element.designationGenerale}</p>
                
                {/* Rating and Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700">{element.anneeMiseEnService}</span>
                    </div>
                    <span className="text-xs text-gray-500">({Math.floor(Math.random() * 200 + 50)} avis)</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {element.type}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-mono text-xs">{element.geolocalisation.latitude.toFixed(4)}, {element.geolocalisation.longitude.toFixed(4)}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105">
                    <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Détails</span>
                  </button>
                  <button className="group flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105">
                    <Navigation className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Itinéraire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-xs text-gray-600 text-center mb-3 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Mis à jour maintenant</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Valeur totale: <span className="font-bold text-green-600">{getTotalValue()}€</span></span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Note: <span className="font-bold text-yellow-600">{getAverageRating()}⭐</span></span>
          </div>
          <button
            onClick={clearSelection}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Effacer la sélection
          </button>
        </div>
      </div>

      <ExportModal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;