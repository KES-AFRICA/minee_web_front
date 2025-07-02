export interface MapElement {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'attraction' | 'shop';
  position: [number, number];
  description: string;
  rating: number;
  price: number;
  image: string;
  category: string;
}

export interface FilterState {
  types: string[];
  priceRange: [number, number];
  ratingMin: number;
  searchQuery: string;
}

export interface SelectionArea {
  bounds: [[number, number], [number, number]] | null;
  shape: 'rectangle' | 'polygon' | 'circle' | null;
  coordinates: [number, number][] | null;
}