import React, { useState } from 'react';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    FeatureGroup,
 } from 'react-leaflet';


// Fix icon issues in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MarkerPoint {
id: number;
position: [number, number];
name: string;
details: string;
}

interface LineData {
id: number;
positions: [number, number][];
color: string;
}

const SigMap: React.FC = () => {
const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
const [markers, setMarkers] = useState<MarkerPoint[]>([
    { id: 1, position: [48.8566, 2.3522], name: 'Point 1', details: 'Details for point 1' },
    { id: 2, position: [48.86, 2.36], name: 'Point 2', details: 'Details for point 2' },
    { id: 3, position: [48.85, 2.34], name: 'Point 3', details: 'Details for point 3' },
    { id: 4, position: [48.87, 2.33], name: 'Point 4', details: 'Details for point 4' },
    { id: 5, position: [48.84, 2.37], name: 'Point 5', details: 'Details for point 5' },
]);

const [lines, setLines] = useState<LineData[]>([
    { id: 1, positions: [[48.8566, 2.3522], [48.86, 2.36]], color: 'red' },
    { id: 2, positions: [[48.85, 2.34], [48.87, 2.33]], color: 'blue' },
    { id: 3, positions: [[48.87, 2.33], [48.84, 2.37]], color: 'green' },
]);

const onCreated = (e: any) => {
    const { layerType, layer } = e;
    console.log('New layer created:', layerType, layer);
    
    // You can save the created shapes to state if needed
    if (layerType === 'marker') {
        const position = layer.getLatLng();
        const newMarker: MarkerPoint = {
            id: markers.length + 1,
            position: [position.lat, position.lng],
            name: `Point ${markers.length + 1}`,
            details: `Details for point ${markers.length + 1}`,
        };
        setMarkers([...markers, newMarker]);
    }
};

return (
    <div className="sig-container">
        <div className="map-controls">
            <button 
                className={`map-button ${mapType === 'map' ? 'active' : ''}`}
                onClick={() => setMapType('map')}
            >
                Map View
            </button>
            <button 
                className={`map-button ${mapType === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapType('satellite')}
            >
                Satellite View
            </button>
        </div>
        
        <MapContainer 
            center={[48.8566, 2.3522]} 
            zoom={13} 
            style={{ height: '80vh', width: '100%' }}
        >
            {mapType === 'map' && (
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            )}
            
            {mapType === 'satellite' && (
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
            )}
            
            {/* Drawing tools */}
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    draw={{
                        rectangle: true,
                        circle: true,
                        polygon: true,
                        marker: true,
                        polyline: true,
                        circlemarker: false,
                    }}
                />
            </FeatureGroup>
            
            {/* Markers */}
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup>
                        <div>
                            <h3>{marker.name}</h3>
                            <p>{marker.details}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            
            {/* Lines */}
            {lines.map((line) => (
                <Polyline
                    key={line.id}
                    positions={line.positions}
                    color={line.color}
                    weight={3}
                />
            ))}
        </MapContainer>
        
        
        
        
    </div>
);
};

export default SigMap;