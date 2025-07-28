import type { Actif, Depart, Filters } from '@/types';
import { fakeActifs, fakeDeparts } from './generateurs';

// Simulation d'API avec des délais réalistes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  private static instance: ApiService;
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Actifs
  async getActifs(filters?: Partial<Filters>): Promise<Actif[]> {
    await delay(800); // Simulation latence réseau
    
    let result = [...fakeActifs];
    
    if (filters) {
      if (filters.types && filters.types.length > 0) {
        result = result.filter(actif => filters.types!.includes(actif.type));
      }
      
      if (filters.regions && filters.regions.length > 0) {
        result = result.filter(actif => filters.regions!.includes(actif.region));
      }
      
      if (filters.etatVisuel && filters.etatVisuel.length > 0) {
        result = result.filter(actif => filters.etatVisuel!.includes(actif.etatVisuel));
      }

      if (filters.etatFonctionnement && filters.etatFonctionnement.length > 0) {
        result = result.filter(actif => 'etatFonctionnement' in actif && filters.etatFonctionnement!.includes(actif.etatFonctionnement as string));
      }
      
      if (filters.anneeMiseEnService && filters.anneeMiseEnService.min !== undefined) {
        result = result.filter(actif => actif.anneeMiseEnService >= filters.anneeMiseEnService!.min);
      }

      if (filters.anneeMiseEnService && filters.anneeMiseEnService.max !== undefined) {
        result = result.filter(actif => actif.anneeMiseEnService <= filters.anneeMiseEnService!.max);
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        result = result.filter(actif => 
          actif.type.toLowerCase().includes(term) ||
          actif.ville.toLowerCase().includes(term) ||
          actif.departement.toLowerCase().includes(term)
        );
      }
      
      // Filtrage par zone géographique
      // if (filters.selectedArea) {
      //   const area = filters.selectedArea;
      //   result = result.filter(actif => {
      //     const { latitude: lat, longitude: lng } = actif.geolocalisation;
          
      //     switch (area.shape) {
      //       case 'rectangle':
      //         if (area.bounds) {
      //           const [[minLat, minLng], [maxLat, maxLng]] = area.bounds;
      //           return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
      //         }
      //         break;
              
      //       case 'circle':
      //         if (area.center && area.radius) {
      //           const [centerLat, centerLng] = area.center;
      //           const distance = Math.sqrt(
      //             Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
      //           );
      //           return distance <= area.radius;
      //         }
      //         break;
              
      //       case 'polygon':
      //         if (area.points && area.points.length > 2) {
      //           // Implémentation simple point-in-polygon
      //           return this.isPointInPolygon([lat, lng], area.points);
      //         }
      //         break;
      //     }
      //     return true;
      //   });
      // }
    }
    
    return result;
  }
  
  private isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }

  async getActif(id: string): Promise<Actif> {
    await delay(300);
    const actif = fakeActifs.find(a => a.id === id);
    if (!actif) {
      throw new Error(`Actif avec l'ID ${id} non trouvé`);
    }
    return actif;
  }

  async createActif(actif: Omit<Actif, 'id'>): Promise<Actif> {
    await delay(500);
    const newActif = {
      ...actif,
      id: `actif_${Date.now()}`
    } as Actif;
    fakeActifs.push(newActif);
    return newActif;
  }

  async updateActif(id: string, updates: Partial<Actif>): Promise<Actif> {
    await delay(400);
    const index = fakeActifs.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Actif avec l'ID ${id} non trouvé`);
    }
    
    fakeActifs[index] = { ...fakeActifs[index], ...updates } as Actif;
    return fakeActifs[index];
  }

  async deleteActif(id: string): Promise<void> {
    await delay(300);
    const index = fakeActifs.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Actif avec l'ID ${id} non trouvé`);
    }
    fakeActifs.splice(index, 1);
  }

  // Départs
  async getDeparts(): Promise<Depart[]> {
    await delay(400);
    return [...fakeDeparts];
  }

  async getDepart(id: string): Promise<Depart> {
    await delay(300);
    const depart = fakeDeparts.find(d => d.id === id);
    if (!depart) {
      throw new Error(`Départ avec l'ID ${id} non trouvé`);
    }
    return depart;
  }

  // Export
  async exportActifs(ids: string[], format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    await delay(1000);
    
    const actifs = fakeActifs.filter(a => ids.includes(a.id));
    let content: string;
    let mimeType: string;
    
    switch (format) {
      case 'csv':
        content = this.generateCSV(actifs);
        mimeType = 'text/csv';
        break;
      case 'excel':
        content = this.generateCSV(actifs); // Simplifié pour la démo
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'pdf':
        content = this.generatePDFContent(actifs);
        mimeType = 'application/pdf';
        break;
      default:
        throw new Error(`Format d'export non supporté: ${format}`);
    }
    
    return new Blob([content], { type: mimeType });
  }

  private generateCSV(actifs: Actif[]): string {
    const headers = ['ID', 'Nom', 'Type', 'Ville', 'Région', 'État Visuel', 'État Fonctionnement', 'Année', 'Valorisation', 'Coordonnées', 'Départ'];
    const rows = actifs.map(actif => [
      actif.id,
      
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private generatePDFContent(actifs: Actif[]): string {
    // Simplifié pour la démo - dans un vrai projet, utiliser une librairie PDF
    const totalValorisation = actifs.reduce((sum, actif) => sum + actif.valorisation, 0);
    const repartitionParType = actifs.reduce((acc, ) => {
      
      
      return acc;
    }, {} as Record<string, number>);
    
    let content = `RAPPORT D'ACTIFS ÉLECTRIQUES\n`;
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    content += `RÉSUMÉ EXÉCUTIF\n`;
    content += `Nombre total d'actifs: ${actifs.length}\n`;
    content += `Valorisation totale: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(totalValorisation)}\n\n`;
    
    content += `RÉPARTITION PAR TYPE\n`;
    Object.entries(repartitionParType).forEach(([type, count]) => {
      content += `${type}: ${count}\n`;
    });
    
    content += `\nDÉTAIL DES ACTIFS\n`;
    actifs.forEach((actif, index) => {
      content += `${index + 1}. ${actif}\n`;
      
    });
    
    return content;
  }

  // Statistiques
  // async getStatistiques(): Promise<StatistiquesDepart[]> {
  //   await delay(600);
  //   return getStatistiquesByDepart(fakeActifs) as StatistiquesDepart[];
  // }

  // Géocodage (simulation)
  async geocodeAddress(address: string): Promise<{lat: number; lng: number} | null> {
    await delay(500);
    // Simulation simple - dans un vrai projet, utiliser une API de géocodage
    const mockResults = [
      { address: 'douala', lat: 4.0511, lng: 9.7679 },
      { address: 'yaoundé', lat: 3.8667, lng: 11.5167 },
      { address: 'bafoussam', lat: 5.4667, lng: 10.4167 }
    ];
    
    const result = mockResults.find(r => address.toLowerCase().includes(r.address));
    return result ? { lat: result.lat, lng: result.lng } : null;
  }
}

export const apiService = ApiService.getInstance();