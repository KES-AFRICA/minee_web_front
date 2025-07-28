import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Layers, Square, Circle, Edit3, Trash2, Move, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';
import L from 'leaflet';

// Types pour nos éléments
interface MapElement {
    id: string;
    name: string;
    position: [number, number];
    layer: string;
    color: string;
    selected: boolean;
    type?: 'point' | 'line' | 'polygon';
    properties?: Record<string, any>;
}

interface LayerConfig {
    id: string;
    name: string;
    color: string;
    visible: boolean;
    count: number;
}

type DrawingMode = 'rectangle' | 'circle' | 'polygon' | null;

const MapView: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
    const drawingLayerRef = useRef<L.LayerGroup | null>(null);
    const currentDrawingRef = useRef<L.Circle | L.Rectangle | L.Polygon | null>(null);
    const startPointRef = useRef<L.LatLng | null>(null);
    const isDrawingRef = useRef(false);
    const polygonPointsRef = useRef<L.LatLng[]>([]);

    const [drawingMode, setDrawingMode] = useState<DrawingMode>(null);
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [isMultiSelect, setIsMultiSelect] = useState(false);

    // Données des éléments étendues
    const [elements, setElements] = useState<MapElement[]>([
        // Ligne 1 - Transformateurs
        { id: '1', name: 'Transformateur A1', position: [48.8566, 2.3522], layer: 'transformateurs', color: '#FF6B6B', selected: false, type: 'point', properties: { power: '630kVA', voltage: '20kV/400V' } },
        { id: '2', name: 'Transformateur A2', position: [48.8576, 2.3532], layer: 'transformateurs', color: '#FF6B6B', selected: false, type: 'point', properties: { power: '400kVA', voltage: '20kV/400V' } },
        { id: '3', name: 'Transformateur A3', position: [48.8586, 2.3542], layer: 'transformateurs', color: '#FF6B6B', selected: false, type: 'point', properties: { power: '1000kVA', voltage: '20kV/400V' } },

        // Ligne 2 - Postes
        { id: '4', name: 'Poste B1', position: [48.8556, 2.3512], layer: 'postes', color: '#4ECDC4', selected: false, type: 'point', properties: { type: 'Distribution', tension: '20kV' } },
        { id: '5', name: 'Poste B2', position: [48.8546, 2.3502], layer: 'postes', color: '#4ECDC4', selected: false, type: 'point', properties: { type: 'Répartition', tension: '63kV' } },
        { id: '6', name: 'Poste B3', position: [48.8536, 2.3492], layer: 'postes', color: '#4ECDC4', selected: false, type: 'point', properties: { type: 'Distribution', tension: '20kV' } },

        // Ligne 3 - Lignes
        { id: '7', name: 'Ligne C1', position: [48.8526, 2.3482], layer: 'lignes', color: '#45B7D1', selected: false, type: 'line', properties: { length: '2.5km', voltage: '20kV' } },
        { id: '8', name: 'Ligne C2', position: [48.8516, 2.3472], layer: 'lignes', color: '#45B7D1', selected: false, type: 'line', properties: { length: '1.8km', voltage: '20kV' } },
        { id: '9', name: 'Ligne C3', position: [48.8506, 2.3462], layer: 'lignes', color: '#45B7D1', selected: false, type: 'line', properties: { length: '3.2km', voltage: '20kV' } },
    ]);

    // Configuration des calques avec compteurs
    const layerConfigs = useMemo((): LayerConfig[] => {
        const configs = [
            { id: 'transformateurs', name: 'Transformateurs', color: '#FF6B6B' },
            { id: 'postes', name: 'Postes', color: '#4ECDC4' },
            { id: 'lignes', name: 'Lignes', color: '#45B7D1' }
        ];

        return configs.map(config => ({
            ...config,
            visible: true,
            count: elements.filter(el => el.layer === config.id).length
        }));
    }, [elements]);

    const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(
        Object.fromEntries(layerConfigs.map(config => [config.id, true]))
    );

    // Fonction pour obtenir l'icône appropriée selon le type
    const getMarkerIcon = useCallback((element: MapElement) => {
        const iconMap = {
            'point': '●',
            'line': '─',
            'polygon': '▲'
        };

        return L.divIcon({
            html: `
                <div style="
                    background-color: ${element.color};
                    border: ${element.selected ? '3px solid #000' : '2px solid #fff'};
                    border-radius: 50%;
                    width: ${element.selected ? '20px' : '16px'};
                    height: ${element.selected ? '20px' : '16px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    transition: all 0.2s ease;
                    transform: ${element.selected ? 'scale(1.2)' : 'scale(1)'};
                ">
                    ${iconMap[element.type || 'point']}
                </div>
            `,
            className: 'custom-marker',
            iconSize: [element.selected ? 20 : 16, element.selected ? 20 : 16],
            iconAnchor: [element.selected ? 10 : 8, element.selected ? 10 : 8]
        });
    }, []);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toggleElementSelection = (elementId: string, multiSelect: boolean = false) => {
        setElements(prev => {
            if (multiSelect || isMultiSelect) {
                // Multi-sélection
                return prev.map(el =>
                    el.id === elementId ? { ...el, selected: !el.selected } : el
                );
            } else {
                // Sélection unique
                return prev.map(el => ({
                    ...el,
                    selected: el.id === elementId ? !el.selected : false
                }));
            }
        });

        setSelectedElements(prev => {
            if (multiSelect || isMultiSelect) {
                if (prev.includes(elementId)) {
                    return prev.filter(id => id !== elementId);
                } else {
                    return [...prev, elementId];
                }
            } else {
                return prev.includes(elementId) ? [] : [elementId];
            }
        });
    };

    const updateMapElements = useCallback(() => {
        if (!leafletMapRef.current) return;

        // Vider tous les calques
        Object.values(layerGroupsRef.current).forEach((layerGroup) => {
            layerGroup.clearLayers();
        });

        // Ajouter les éléments
        elements.forEach((element) => {
            if (!layerVisibility[element.layer]) return;

            const marker = L.marker(element.position, {
                icon: getMarkerIcon(element)
            });

            // Popup enrichi
            const popupContent = `
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: ${element.color}; font-weight: bold;">
                        ${element.name}
                    </h3>
                    <div style="margin-bottom: 8px;">
                        <strong>Calque:</strong> ${layerConfigs.find(c => c.id === element.layer)?.name || element.layer}
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>Type:</strong> ${element.type || 'point'}
                    </div>
                    ${element.properties ? Object.entries(element.properties).map(([key, value]) =>
                `<div><strong>${key}:</strong> ${value}</div>`
            ).join('') : ''}
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                        Position: ${element.position[0].toFixed(4)}, ${element.position[1].toFixed(4)}
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, { maxWidth: 300 });

            marker.on('click', (e) => {
                // Empêcher la propagation si on est en mode dessin
                if (drawingMode) {
                    e.originalEvent?.stopPropagation();
                    return;
                }
                toggleElementSelection(element.id, e.originalEvent?.ctrlKey || e.originalEvent?.metaKey || false);
            });

            // Ajouter des événements hover
            marker.on('mouseover', () => {
                if (!element.selected) {
                    marker.setIcon(getMarkerIcon({ ...element, selected: true }));
                }
            });

            marker.on('mouseout', () => {
                if (!element.selected) {
                    marker.setIcon(getMarkerIcon(element));
                }
            });

            layerGroupsRef.current[element.layer].addLayer(marker);
        });
    }, [elements, layerVisibility, getMarkerIcon, layerConfigs, drawingMode, toggleElementSelection]);

    

    const toggleLayerVisibility = (layerName: string) => {
        setLayerVisibility(prev => ({
            ...prev,
            [layerName]: !prev[layerName]
        }));

        const layerGroup = layerGroupsRef.current[layerName];
        if (layerGroup && leafletMapRef.current) {
            if (layerVisibility[layerName]) {
                leafletMapRef.current.removeLayer(layerGroup);
            } else {
                leafletMapRef.current.addLayer(layerGroup);
            }
        }
    };

    const handleMouseDown = useCallback((e: L.LeafletMouseEvent) => {
        if (!drawingMode || !drawingLayerRef.current) return;

        e.originalEvent?.preventDefault();
        e.originalEvent?.stopPropagation();

        isDrawingRef.current = true;
        startPointRef.current = e.latlng;

        if (drawingMode === 'rectangle') {
            const latLng1: L.LatLngTuple = [e.latlng.lat, e.latlng.lng];
            const latLng2: L.LatLngTuple = [e.latlng.lat, e.latlng.lng];
            currentDrawingRef.current = L.rectangle([latLng1, latLng2], {
                color: '#ff7800',
                weight: 2,
                fillOpacity: 0.2,
                dashArray: '5, 5'
            }).addTo(drawingLayerRef.current);
        } else if (drawingMode === 'circle') {
            currentDrawingRef.current = L.circle(e.latlng, {
                radius: 0,
                color: '#ff7800',
                weight: 2,
                fillOpacity: 0.2,
                dashArray: '5, 5'
            }).addTo(drawingLayerRef.current);
        } else if (drawingMode === 'polygon') {
            if (polygonPointsRef.current.length === 0) {
                polygonPointsRef.current = [e.latlng];
                currentDrawingRef.current = L.polygon([e.latlng], {
                    color: '#ff7800',
                    weight: 2,
                    fillOpacity: 0.2,
                    dashArray: '5, 5'
                }).addTo(drawingLayerRef.current);
            } else {
                polygonPointsRef.current.push(e.latlng);
                if (currentDrawingRef.current instanceof L.Polygon) {
                    currentDrawingRef.current.setLatLngs(polygonPointsRef.current);
                }
            }
        }
    }, [drawingMode]);

    const handleMouseMove = useCallback((e: L.LeafletMouseEvent) => {
        if (!isDrawingRef.current || !startPointRef.current) return;

        if (drawingMode === 'rectangle' && currentDrawingRef.current instanceof L.Rectangle) {
            const startPoint: L.LatLngTuple = [startPointRef.current.lat, startPointRef.current.lng];
            const endPoint: L.LatLngTuple = [e.latlng.lat, e.latlng.lng];
            currentDrawingRef.current.setBounds([startPoint, endPoint]);
        } else if (drawingMode === 'circle' && currentDrawingRef.current instanceof L.Circle) {
            const radius = startPointRef.current.distanceTo(e.latlng);
            currentDrawingRef.current.setRadius(radius);
        }
    }, [drawingMode]);

    const selectElementsInDrawing = useCallback((drawing: L.Circle | L.Rectangle | L.Polygon) => {
        const selectedIds: string[] = [];

        elements.forEach(element => {
            let isInside = false;
            const elementLatLng = L.latLng(element.position[0], element.position[1]);

            if (drawing instanceof L.Rectangle) {
                const bounds = drawing.getBounds();
                isInside = bounds.contains(elementLatLng);
            } else if (drawing instanceof L.Circle) {
                const center = drawing.getLatLng();
                const radius = drawing.getRadius();
                const distance = center.distanceTo(elementLatLng);
                isInside = distance <= radius;
            } else if (drawing instanceof L.Polygon) {
                // Vérification point dans polygone (approximation)
                const bounds = drawing.getBounds();
                isInside = bounds.contains(elementLatLng);
            }

            if (isInside) {
                selectedIds.push(element.id);
            }
        });

        // Mettre à jour la sélection
        setElements(prev => prev.map(el => ({
            ...el,
            selected: selectedIds.includes(el.id)
        })));

        setSelectedElements(selectedIds);
    }, [elements]);

    const handleMouseUp = useCallback((e: L.LeafletMouseEvent) => {
        if (!isDrawingRef.current || !currentDrawingRef.current) return;

        if (drawingMode === 'polygon') {
            // Pour le polygone, on continue jusqu'au double-clic
            return;
        }

        isDrawingRef.current = false;
        selectElementsInDrawing(currentDrawingRef.current);

        // Nettoyer le dessin après un délai
        setTimeout(() => {
            if (drawingLayerRef.current) {
                drawingLayerRef.current.clearLayers();
            }
            currentDrawingRef.current = null;
            startPointRef.current = null;
        }, 1500);
    }, [drawingMode, selectElementsInDrawing]);

    const handleDoubleClick = useCallback((e: L.LeafletMouseEvent) => {
        if (drawingMode === 'polygon' && polygonPointsRef.current.length > 2) {
            if (currentDrawingRef.current) {
                selectElementsInDrawing(currentDrawingRef.current);
            }

            // Nettoyer
            setTimeout(() => {
                if (drawingLayerRef.current) {
                    drawingLayerRef.current.clearLayers();
                }
                currentDrawingRef.current = null;
                polygonPointsRef.current = [];
            }, 1500);
        }
    }, [drawingMode, selectElementsInDrawing]);

    const clearSelection = () => {
        setElements(prev => prev.map(el => ({ ...el, selected: false })));
        setSelectedElements([]);
        if (drawingLayerRef.current) {
            drawingLayerRef.current.clearLayers();
        }
        setDrawingMode(null);
        polygonPointsRef.current = [];
    };

    const deleteSelected = () => {
        setElements(prev => prev.filter(el => !el.selected));
        setSelectedElements([]);
    };

    const selectAll = () => {
        const visibleElements = elements.filter(el => layerVisibility[el.layer]);
        setElements(prev => prev.map(el => ({
            ...el,
            selected: layerVisibility[el.layer]
        })));
        setSelectedElements(visibleElements.map(el => el.id));
    };

    const zoomToSelected = () => {
        if (selectedElements.length === 0 || !leafletMapRef.current) return;

        const selectedPositions = elements
            .filter(el => selectedElements.includes(el.id))
            .map(el => el.position as L.LatLngTuple);

        if (selectedPositions.length === 1) {
            leafletMapRef.current.setView(selectedPositions[0], 16);
        } else {
            const bounds = L.latLngBounds(selectedPositions);
            leafletMapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
    };

    const resetView = () => {
        if (!leafletMapRef.current) return;
        leafletMapRef.current.setView([48.8566, 2.3522], 13);
    };

    // Effet pour initialiser la carte
    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;

        leafletMapRef.current = L.map(mapRef.current, {
            center: [48.8566, 2.3522],
            zoom: 13,
            zoomControl: false // On va créer nos propres contrôles
        });

        // Ajouter la couche de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(leafletMapRef.current);

        // Créer les groupes de calques
        layerConfigs.forEach(config => {
            layerGroupsRef.current[config.id] = L.layerGroup().addTo(leafletMapRef.current!);
        });

        drawingLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, [layerConfigs]);

    // Effet pour les événements de la carte
    useEffect(() => {
        if (!leafletMapRef.current) return;

        const map = leafletMapRef.current;

        map.on('mousedown', handleMouseDown);
        map.on('mousemove', handleMouseMove);
        map.on('mouseup', handleMouseUp);
        map.on('dblclick', handleDoubleClick);

        if (drawingMode) {
            map.dragging.disable();
            map.doubleClickZoom.disable();
        } else {
            map.dragging.enable();
            map.doubleClickZoom.enable();
        }

        return () => {
            map.off('mousedown', handleMouseDown);
            map.off('mousemove', handleMouseMove);
            map.off('mouseup', handleMouseUp);
            map.off('dblclick', handleDoubleClick);
        };
    }, [drawingMode, handleMouseDown, handleMouseMove, handleMouseUp, handleDoubleClick]);

    useEffect(() => {
        updateMapElements();
    }, [updateMapElements]);

    return (
        <div className="w-full h-screen bg-gray-100 relative">
            {/* Barre d'outils principale */}
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex flex-col space-y-4">
                    {/* Contrôles de sélection */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Outils de sélection</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setDrawingMode(drawingMode === 'rectangle' ? null : 'rectangle')}
                                className={`p-2 rounded transition-colors ${drawingMode === 'rectangle'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                title="Sélection rectangulaire"
                            >
                                <Square size={16} />
                            </button>
                            <button
                                onClick={() => setDrawingMode(drawingMode === 'circle' ? null : 'circle')}
                                className={`p-2 rounded transition-colors ${drawingMode === 'circle'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                title="Sélection circulaire"
                            >
                                <Circle size={16} />
                            </button>
                            <button
                                onClick={() => setIsMultiSelect(!isMultiSelect)}
                                className={`p-2 rounded transition-colors ${isMultiSelect
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                title="Multi-sélection"
                            >
                                <Move size={16} />
                            </button>
                            <button
                                onClick={clearSelection}
                                className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                title="Effacer la sélection"
                            >
                                <Edit3 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions sur la sélection */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={selectAll}
                                className="p-2 text-xs rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                                title="Tout sélectionner"
                            >
                                Tout sélect.
                            </button>
                            <button
                                onClick={zoomToSelected}
                                className={`p-2 text-xs rounded transition-colors ${selectedElements.length === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                                    }`}
                                disabled={selectedElements.length === 0}
                                title="Zoomer sur sélection"
                            >
                                Zoomer
                            </button>
                            <button
                                onClick={resetView}
                                className="p-2 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                title="Vue initiale"
                            >
                                <RotateCcw size={12} />
                            </button>
                            <button
                                onClick={deleteSelected}
                                className={`p-2 rounded transition-colors ${selectedElements.length === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-200 hover:bg-red-300 text-red-700'
                                    }`}
                                disabled={selectedElements.length === 0}
                                title="Supprimer sélection"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Contrôle des calques */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm flex items-center">
                            <Layers size={16} className="mr-1" />
                            Calques
                        </h3>
                        {layerConfigs.map((config) => (
                            <label key={config.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={layerVisibility[config.id]}
                                    onChange={() => toggleLayerVisibility(config.id)}
                                    className="rounded"
                                />
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                ></span>
                                <span className="flex-1">{config.name}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {config.count}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleLayerVisibility(config.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title={layerVisibility[config.id] ? 'Masquer' : 'Afficher'}
                                >
                                    {layerVisibility[config.id] ? <Eye size={12} /> : <EyeOff size={12} />}
                                </button>
                            </label>
                        ))}
                    </div>

                    {/* Informations sur la sélection */}
                    {selectedElements.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm">Sélectionnés ({selectedElements.length})</h3>
                            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                                {elements
                                    .filter(el => selectedElements.includes(el.id))
                                    .map(el => (
                                        <div key={el.id} className="text-gray-600 px-2 py-1 bg-gray-50 rounded flex items-center">
                                            <span
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: el.color }}
                                            ></span>
                                            <span className="flex-1 truncate">{el.name}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contrôles de zoom */}
            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2">
                <div className="flex flex-col space-y-1">
                    <button
                        onClick={() => leafletMapRef.current?.zoomIn()}
                        className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom avant"
                    >
                        <ZoomIn size={16} />
                    </button>
                    <button
                        onClick={() => leafletMapRef.current?.zoomOut()}
                        className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom arrière"
                    >
                        <ZoomOut size={16} />
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <h3 className="font-semibold text-sm mb-2">Mode actuel</h3>
                <div className="text-xs space-y-1 text-gray-600">
                    {drawingMode ? (
                        <>
                            <div className="text-blue-600 font-medium">
                                🎯 Mode {drawingMode === 'rectangle' ? 'Rectangle' : drawingMode === 'circle' ? 'Cercle' : 'Polygone'} actif
                            </div>
                            <div>• Dessinez sur la carte pour sélectionner</div>
                            {drawingMode === 'polygon' && <div>• Double-clic pour terminer le polygone</div>}
                        </>
                    ) : (
                        <>
                            <div className="text-green-600 font-medium">
                                👆 Mode Navigation
                            </div>
                            <div>• Cliquez sur les éléments pour les sélectionner</div>
                            <div>• {isMultiSelect ? 'Multi-sélection activée' : 'Ctrl+Clic pour multi-sélection'}</div>
                        </>
                    )}
                </div>
            </div>

            {/* Statistiques */}
            <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
                <h3 className="font-semibold text-sm mb-2">Statistiques</h3>
                <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                        <span>Total éléments :</span>
                        <span className="font-medium">{elements.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Visibles :</span>
                        <span className="font-medium">
                            {elements.filter(el => layerVisibility[el.layer]).length}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Sélectionnés :</span>
                        <span className="font-medium text-blue-600">{selectedElements.length}</span>
                    </div>
                    {layerConfigs.map(config => (
                        <div key={config.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: config.color }}
                                ></span>
                                <span>{config.name.slice(0, 8)}...</span>
                            </div>
                            <span className="font-medium">{config.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carte */}
            <div
                ref={mapRef}
                className="w-full h-full"
                style={{
                    cursor: drawingMode ? 'crosshair' : 'grab',
                    minHeight: '400px'
                }}
            />

            {/* Styles CSS intégrés */}
            <style>{`
                .custom-marker {
                    background: transparent !important;
                    border: none !important;
                }
                
                .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .leaflet-popup-content {
                    margin: 12px;
                    line-height: 1.4;
                }
                
                .leaflet-popup-tip {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                
                .leaflet-container {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                
                /* Animation pour les marqueurs sélectionnés */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }
                
                /* Personnalisation des scrollbars */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
                
                /* Amélioration des boutons */
                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                button:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                button:not(:disabled):active {
                    transform: translateY(0);
                }
                
                /* Amélioration des cases à cocher */
                input[type="checkbox"] {
                    accent-color: #3b82f6;
                }
                
                /* Animation des panneaux */
                .absolute {
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Styles pour le mode dessin */
                .leaflet-container.crosshair-cursor-enabled {
                    cursor: crosshair !important;
                }
                
                .leaflet-container.crosshair-cursor-enabled * {
                    cursor: crosshair !important;
                }
                
                /* Amélioration des tooltips */
                [title] {
                    position: relative;
                }
                
                [title]:hover::after {
                    content: attr(title);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1f2937;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    white-space: nowrap;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                [title]:hover::before {
                    content: '';
                    position: absolute;
                    bottom: calc(100% - 5px);
                    left: 50%;
                    transform: translateX(-50%);
                    border: 5px solid transparent;
                    border-top-color: #1f2937;
                    z-index: 10000;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default MapView;