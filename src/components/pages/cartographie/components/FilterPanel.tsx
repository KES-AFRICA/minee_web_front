import { mtData, posteData, supportsData } from "@/data/sup";
import { useFilterActions, useFilteredCount, useFilters, useHasActiveFilters, useMapStore } from "@/store/map_store";

// Composant pour le panneau de filtres
export const FilterPanel: React.FC = () => {
  const filters = useFilters();
  const { setFilter, clearFilters, clearFilter, applyFilters } = useFilterActions();
  const { toggleFilterPanel } = useMapStore();
  const hasActiveFilters = useHasActiveFilters();
  const filteredCount = useFilteredCount();

  const handleApplyFilters = () => {
    applyFilters({
      mt: mtData.features,
      postes: posteData.features,
      supports: supportsData.features,
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '300px',
      maxHeight: '500px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Filtres</h3>
        <button onClick={toggleFilterPanel} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Recherche générale */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Recherche générale
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => setFilter('searchTerm', e.target.value)}
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        />
      </div>

      {/* Filtres pour les supports */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Supports</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.supportType || ''}
              onChange={(e) => setFilter('supportType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="bois">Bois</option>
              <option value="metallique">Métallique</option>
              <option value="beton">Béton</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Statut</label>
            <select
              value={filters.supportStatus || ''}
              onChange={(e) => setFilter('supportStatus', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="bon">Bon</option>
              <option value="moyen">Moyen</option>
              <option value="mauvais">Mauvais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres pour les postes */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Postes</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.postType || ''}
              onChange={(e) => setFilter('postType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="H59">H59</option>
              <option value="H61">H61</option>
              <option value="H63">H63</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Tension</label>
            <select
              value={filters.postVoltage || ''}
              onChange={(e) => setFilter('postVoltage', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Toutes</option>
              <option value="5.5kV">5.5kV</option>
              <option value="15kV">15kV</option>
              <option value="30kV">30kV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres pour les lignes */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Lignes MT</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.lineType || ''}
              onChange={(e) => setFilter('lineType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="aerienne">Aérienne</option>
              <option value="souterraine">Souterraine</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Statut</label>
            <select
              value={filters.lineStatus || ''}
              onChange={(e) => setFilter('lineStatus', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button
          onClick={handleApplyFilters}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Appliquer ({filteredCount})
        </button>
        <button
          onClick={clearFilters}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Effacer
        </button>
      </div>

      {hasActiveFilters && (
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#28a745' }}>
          ✓ Filtres actifs - {filteredCount} résultats
        </div>
      )}
    </div>
  );
};
