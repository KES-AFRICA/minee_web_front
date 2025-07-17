import { useMapStore, useSelectedCount, useSelection, useSelectionActions } from "@/store/map_store";

// Composant pour le panneau de sélection
export const SelectionPanel: React.FC = () => {
  const selection = useSelection();
  const { clearSelection, setSelectionMode, selectAll } = useSelectionActions();
  const { toggleSelectionPanel } = useMapStore();
  const selectedCount = useSelectedCount();

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
          Sélection ({selectedCount})
        </h3>
        <button onClick={toggleSelectionPanel} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Mode de sélection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Mode de sélection
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="selectionMode"
              checked={selection.selectionMode === 'single'}
              onChange={() => setSelectionMode('single')}
              style={{ marginRight: '5px' }}
            />
            Simple
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="selectionMode"
              checked={selection.selectionMode === 'multiple'}
              onChange={() => setSelectionMode('multiple')}
              style={{ marginRight: '5px' }}
            />
            Multiple
          </label>
        </div>
      </div>

      {/* Actions de sélection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Actions
        </label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button
            onClick={() => selectAll()}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Tout sélectionner
          </button>
          <button
            onClick={() => selectAll('mt')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Lignes MT
          </button>
          <button
            onClick={() => selectAll('postes')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Postes
          </button>
          <button
            onClick={() => selectAll('supports')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Supports
          </button>
          <button
            onClick={clearSelection}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #dc3545',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              color: '#dc3545'
            }}
          >
            Effacer
          </button>
        </div>
      </div>

      {/* Liste des éléments sélectionnés */}
      {selection.selectedFeatures.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
            Éléments sélectionnés
          </label>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            {selection.selectedFeatures.map((feature, index) => (
              <div key={index} style={{
                padding: '5px',
                border: '1px solid #eee',
                borderRadius: '3px',
                marginBottom: '3px',
                fontSize: '10px'
              }}>
                <strong>{feature.properties.name || feature.properties.id || `Item ${index + 1}`}</strong>
                <br />
                <span style={{ color: '#666' }}>
                  {feature.geometry.type} - {Object.keys(feature.properties).length} propriétés
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};