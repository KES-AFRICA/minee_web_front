import L from "leaflet";

// Données fictives pour les lampadaires existants
export const existingLampposts = [
  {
    id: "LP001",
    code: "ENEO-BT-001",
    owner: {
      name: "Jean Dupont",
      type: "Particulier",
      address: "123 Rue de la Paix, Yaoundé",
      phone: "+237 694 123 456",
      email: "jean.dupont@email.com",
      registrationDate: "2024-01-15",
    },
    location: {
      latitude: 3.848,
      longitude: 11.5021,
      address: "Avenue Charles de Gaulle, Yaoundé",
      sector: "Centre-ville",
    },
    technical: {
      power: "150W",
      type: "LED",
      brand: "Philips",
      model: "StreetLight Pro",
      installationDate: "2024-01-20",
      lastMaintenance: "2024-11-15",
    },
    status: "Actif",
    photos: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
  },
  {
    id: "LP002",
    code: "ENEO-BT-002",
    owner: {
      name: "Société CAMTEL",
      type: "Entreprise",
      address: "Immeuble CAMTEL, Bastos, Yaoundé",
      phone: "+237 222 123 456",
      email: "contact@camtel.cm",
      registrationDate: "2024-02-10",
    },
    location: {
      latitude: 3.865,
      longitude: 11.518,
      address: "Quartier Bastos, Yaoundé",
      sector: "Bastos",
    },
    technical: {
      power: "200W",
      type: "LED",
      brand: "Osram",
      model: "CityTouch",
      installationDate: "2024-02-15",
      lastMaintenance: "2024-12-01",
    },
    status: "Actif",
    photos: ["/api/placeholder/300/200"],
  },
];

export interface Lamppost {
  id: number;
  code: string;
  type: "LED" | "Decharges";
  name: string;
  owner: string;
  phone: string;
  status: "on" | "off";
  isOnline: boolean;
  municipality: string;
  voltage: number;
  current: number;
  power: number;
  powerFactor: number;
  temperature: number;
  humidity: number;
  lastMaintenance: string;
  bulbStatus: "good" | "warning" | "burnt" | "offline";
  energyQuality: "excellent" | "good" | "poor" | "unknown";
  alerts: string[];
  location: string;
  brightness_level: number;
  lamps: {
    id: number;
    has_lamp: number;
    is_on_day: number;
    is_on_night: number;
    lamp_type: string;
    lamp_color: string;
  }[];
}

// Configuration des icônes Leaflet
export const defaultIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
