export interface ExportOptions {
  format: 'json' | 'csv' | 'geojson' | 'kml';
  includeImages: boolean;
  includeCoordinates: boolean;
  includeFilters: boolean;
}

export interface ExportData {
  exportDate: string;
  totalElements: number;
  appliedFilters?: any;
  elements: any[];
  selectionArea?: any;
}

export const exportSelection = (
  selectedElements: any[],
  options: ExportOptions,
  filters?: any,
  selectionArea?: any
) => {
  const exportData: ExportData = {
    exportDate: new Date().toISOString(),
    totalElements: selectedElements.length,
    elements: selectedElements.map(element => ({
      id: element.id,
      name: element.name,
      type: element.type,
      description: element.description,
      rating: element.rating,
      price: element.price,
      category: element.category,
      ...(options.includeCoordinates && {
        latitude: element.position[0],
        longitude: element.position[1]
      }),
      ...(options.includeImages && { image: element.image })
    }))
  };

  if (options.includeFilters && filters) {
    exportData.appliedFilters = filters;
  }

  if (selectionArea) {
    exportData.selectionArea = selectionArea;
  }

  switch (options.format) {
    case 'json':
      return exportAsJSON(exportData);
    case 'csv':
      return exportAsCSV(exportData.elements);
    case 'geojson':
      return exportAsGeoJSON(selectedElements);
    case 'kml':
      return exportAsKML(selectedElements);
    default:
      return exportAsJSON(exportData);
  }
};

const exportAsJSON = (data: ExportData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mapview-selection-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportAsCSV = (elements: any[]) => {
  if (elements.length === 0) return;

  const headers = Object.keys(elements[0]).join(',');
  const rows = elements.map(element => 
    Object.values(element).map(value => 
      typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    ).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mapview-selection-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportAsGeoJSON = (elements: any[]) => {
  const geojson = {
    type: 'FeatureCollection',
    features: elements.map(element => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [element.position[1], element.position[0]] // GeoJSON uses [lng, lat]
      },
      properties: {
        id: element.id,
        name: element.name,
        type: element.type,
        description: element.description,
        rating: element.rating,
        price: element.price,
        category: element.category,
        image: element.image
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: 'application/geo+json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mapview-selection-${new Date().toISOString().split('T')[0]}.geojson`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportAsKML = (elements: any[]) => {
  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>MapView Selection</name>
    <description>Exported selection from MapView Explorer</description>
    ${elements.map(element => `
    <Placemark>
      <name>${element.name}</name>
      <description><![CDATA[
        <div>
          <h3>${element.name}</h3>
          <p><strong>Type:</strong> ${element.type}</p>
          <p><strong>Description:</strong> ${element.description}</p>
          <p><strong>Rating:</strong> ${element.rating} ⭐</p>
          <p><strong>Price:</strong> ${element.price}€</p>
          <p><strong>Category:</strong> ${element.category}</p>
          ${element.image ? `<img src="${element.image}" alt="${element.name}" style="max-width: 200px;">` : ''}
        </div>
      ]]></description>
      <Point>
        <coordinates>${element.position[1]},${element.position[0]},0</coordinates>
      </Point>
    </Placemark>`).join('')}
  </Document>
</kml>`;

  const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mapview-selection-${new Date().toISOString().split('T')[0]}.kml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateShareableLink = (selectedElements: any[], filters: any) => {
  const data = {
    elements: selectedElements.map(el => el.id),
    filters: filters,
    timestamp: Date.now()
  };
  
  const encoded = btoa(JSON.stringify(data));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};