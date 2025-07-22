/* eslint-disable @typescript-eslint/no-explicit-any */
import { useExportActions, useFilteredCount, useMapStore, useSelectedCount, type ExportOptions } from "@/store/map_store";
import { useState } from "react";

// Composant pour le panneau d'exportation
export const ExportPanel: React.FC = () => {
  const { toggleExportPanel } = useMapStore();
  const { exportSelection, exportFilteredData, exportAll } = useExportActions();
  const selectedCount = useSelectedCount();
  const filteredCount = useFilteredCount();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeGeometry: true,
    selectedOnly: false,
    layerTypes: ['mt', 'postes', 'supports']
  });

  const handleExport = (type: 'selection' | 'filtered' | 'all') => {
    switch (type) {
      case 'selection':
        exportSelection(exportOptions);
        break;
      case 'filtered':
        exportFilteredData(exportOptions);
        break;
      case 'all':
        exportAll(exportOptions);
        break;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      minWidth: '400px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Exportation</h3>
        <button onClick={toggleExportPanel} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Options d'exportation */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
          Format d'exportation
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['json', 'csv', 'kml', 'excel'] as const).map(format => (
            <label key={format} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="format"
                value={format}
                checked={exportOptions.format === format}
                onChange={(e) => setExportOptions({...exportOptions, format: e.target.value as any})}
                style={{ marginRight: '5px' }}
              />
              {format.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Couches à exporter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
          Couches à exporter
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['mt', 'postes', 'supports'] as const).map(layer => (
            <label key={layer} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={exportOptions.layerTypes.includes(layer)}
                onChange={(e) => {
                  const newLayerTypes = e.target.checked
                    ? [...exportOptions.layerTypes, layer]
                    : exportOptions.layerTypes.filter(l => l !== layer);
                  setExportOptions({...exportOptions, layerTypes: newLayerTypes});
                }}
                style={{ marginRight: '5px' }}
              />
              {layer === 'mt' ? 'Lignes MT' : layer === 'postes' ? 'Postes' : 'Supports'}
            </label>
          ))}
        </div>
      </div>

      {/* Options supplémentaires */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={exportOptions.includeGeometry}
            onChange={(e) => setExportOptions({...exportOptions, includeGeometry: e.target.checked})}
            style={{ marginRight: '5px' }}
          />
          Inclure la géométrie
        </label>
      </div>

      {/* Boutons d'exportation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleExport('selection')}
          disabled={selectedCount === 0}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: selectedCount > 0 ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Sélection ({selectedCount})
        </button>
        <button
          onClick={() => handleExport('filtered')}
          disabled={filteredCount === 0}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: filteredCount > 0 ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: filteredCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Filtrés ({filteredCount})
        </button>
        <button
          onClick={() => handleExport('all')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Tout
        </button>
      </div>
    </div>
  );
};