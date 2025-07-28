 
import React from 'react';
import { Map, Satellite, Maximize, Square, X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

const MapControls: React.FC = () => {
  const {
    mapView,
    setMapView,
    showSelectionTools,
    toggleSelectionTools,
    setSelectionArea,
    selectionArea
  } = useAppStore();

  const handleFullscreen = () => {
    const mapElement = document.querySelector('.leaflet-container')?.parentElement;
    if (mapElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapElement.requestFullscreen();
      }
    }
  };

  // const handleResetView = () => {
  //   // Reset view to Cameroon center
  //   console.log('Resetting map view to Cameroon center');
  //   const map = (window as any).__leafletMap;
  //   if (map) {
  //     map.setView([4.0511, 9.7679], 8);
  //   }
  // };

  //const handleSelectionTool = (tool: 'rectangle' | 'circle' | 'polygon') => {
  //  // Ici on pourrait implémenter la logique de sélection
  //  console.log(`Outil de sélection activé: ${tool}`);
  //};

  const clearSelection = () => {
    setSelectionArea(null);
  };

  return (
    <>
      {/* Contrôles principaux - Position absolue en haut à droite */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
        <div className="flex flex-col space-y-2">
          {/* Toggle Vue Carte/Satellite */}
          <div className="flex rounded-md overflow-hidden border">
            <button
              onClick={() => setMapView('carte')}
              className={`px-3 py-2 text-xs font-medium transition-colors flex items-center ${
                mapView === 'carte'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Vue carte"
            >
              <Map className="w-4 h-4 mr-1" />
              Carte
            </button>
            <button
              onClick={() => setMapView('satellite')}
              className={`px-3 py-2 text-xs font-medium transition-colors flex items-center ${
                mapView === 'satellite'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Vue satellite"
            >
              <Satellite className="w-4 h-4 mr-1" />
              Satellite
            </button>
          </div>

          {/* Autres contrôles */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleFullscreen}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex rounded transition-colors border border-gray-200"
              title="Plein écran"
              
            >
              <Maximize className="w-4 h-4" />
              <div className="ml-2 text-xs">Plein écran</div>
            </button>

           
            <button
              onClick={toggleSelectionTools}
              className={`p-2 rounded transition-colors flex ${
                showSelectionTools
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Outils de sélection"
            >
              <Square className="w-4 h-4" />
              <div className="ml-2 text-xs">Sélection</div>
            </button>

            {selectionArea && (
              <button
                onClick={clearSelection}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Effacer la sélection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>


      

      {/* Panneau d'outils de sélection simplifié */}
      {showSelectionTools && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3" style={{ display: 'none' }}>
          
          <div className="space-y-2">
            <hr className="my-2" />
            
            <button
              onClick={clearSelection}
              className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Effacer sélection
            </button>
          </div>
        </div>
      )}
      {/* Barre de recherche géographique - Position absolue en bas
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Rechercher une adresse..."
              className="flex-1 outline-none text-sm text-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Implémenter la recherche géographique
                  console.log('Recherche:', e.currentTarget.value);
                }
              }}
            />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MapControls;