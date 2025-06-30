import type { Asset, Alert } from './types';

const generateRandomAlerts = (): Alert[] => {
  const alertTypes: Alert['type'][] = ['warning', 'error', 'info'];
  const severities: Alert['severity'][] = ['high', 'medium', 'low'];
  const messages = [
    'Température élevée détectée',
    'Maintenance préventive requise',
    'Surcharge détectée',
    'Tension anormale',
    'Vibrations inhabituelles',
    'Inspection programmée',
  ];

  const numAlerts = Math.floor(Math.random() * 3);
  const alerts: Alert[] = [];

  for (let i = 0; i < numAlerts; i++) {
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
    });
  }

  return alerts;
};

export const fakeAssets: Asset[] = [
  {
    id: 'TR-001',
    name: 'Transformateur HT Douala',
    type: 'Transformateur',
    position: [4.0511, 9.7679],
    status: 'Actif',
    capacity: '50 MVA',
    lastInspection: '2023-10-15',
    nextMaintenance: '2024-02-15',
    region: 'Littoral',
    criticality: 'Haute',
    installationDate: '2018-03-15',
    temperature: 65,
    load: 85,
    voltage: 220,
    alerts: generateRandomAlerts(),
    specifications: {
      manufacturer: 'ABB',
      model: 'OLTC-50',
      year: 2018,
      efficiency: '98.5%',
    },
  },
  {
    id: 'LG-045',
    name: 'Ligne 90kV Yaoundé',
    type: 'Ligne',
    position: [3.848, 11.5021],
    status: 'En maintenance',
    length: '15 km',
    lastInspection: '2023-11-02',
    nextMaintenance: '2024-01-10',
    region: 'Centre',
    criticality: 'Moyenne',
    installationDate: '2020-06-10',
    voltage: 90,
    load: 45,
    alerts: generateRandomAlerts(),
    specifications: {
      conductorType: 'ACSR',
      towers: 45,
      insulators: 'Composite',
    },
  },
  {
    id: 'PS-032',
    name: 'Poste Garoua',
    type: 'Poste',
    position: [9.3265, 13.3978],
    status: 'Actif',
    capacity: '30 MVA',
    lastInspection: '2023-09-20',
    nextMaintenance: '2024-03-20',
    region: 'Nord',
    criticality: 'Faible',
    installationDate: '2019-08-12',
    voltage: 132,
    load: 60,
    alerts: generateRandomAlerts(),
    specifications: {
      bays: 6,
      protection: 'Numérique',
      automation: 'SCADA',
    },
  },
  {
    id: 'GN-008',
    name: 'Générateur Bafoussam',
    type: 'Générateur',
    position: [5.4781, 10.4199],
    status: 'En alerte',
    capacity: '25 MW',
    lastInspection: '2023-11-10',
    nextMaintenance: '2024-01-25',
    region: 'Ouest',
    criticality: 'Haute',
    installationDate: '2017-12-05',
    temperature: 78,
    load: 92,
    voltage: 11,
    alerts: generateRandomAlerts(),
    specifications: {
      type: 'Synchrone',
      fuel: 'Diesel',
      efficiency: '95.2%',
    },
  },
  {
    id: 'CM-156',
    name: 'Compteur Bertoua',
    type: 'Compteur',
    position: [4.5772, 13.6848],
    status: 'Actif',
    lastInspection: '2023-10-28',
    nextMaintenance: '2024-04-28',
    region: 'Est',
    criticality: 'Faible',
    installationDate: '2021-01-15',
    alerts: generateRandomAlerts(),
    specifications: {
      type: 'Smart Meter',
      communication: '4G',
      accuracy: 'Class 1',
    },
  },
  // Ajout de plus d'actifs pour tester le clustering
  {
    id: 'TR-002',
    name: 'Transformateur MT Kribi',
    type: 'Transformateur',
    position: [2.9444, 9.9075],
    status: 'Actif',
    capacity: '25 MVA',
    lastInspection: '2023-09-30',
    nextMaintenance: '2024-01-30',
    region: 'Sud',
    criticality: 'Moyenne',
    installationDate: '2019-07-20',
    temperature: 58,
    load: 70,
    voltage: 15,
    alerts: [],
    specifications: {
      manufacturer: 'Schneider',
      model: 'Trihal',
      year: 2019,
    },
  },
  {
    id: 'LG-046',
    name: 'Ligne 225kV Douala-Yaoundé',
    type: 'Ligne',
    position: [3.5, 10.5],
    status: 'Actif',
    length: '245 km',
    lastInspection: '2023-10-05',
    nextMaintenance: '2024-05-05',
    region: 'Centre',
    criticality: 'Haute',
    installationDate: '2015-11-30',
    voltage: 225,
    load: 88,
    alerts: generateRandomAlerts(),
    specifications: {
      conductorType: 'ACSR/TW',
      towers: 820,
      capacity: '500 MW',
    },
  },
  {
    id: 'PS-033',
    name: 'Poste Limbé',
    type: 'Poste',
    position: [4.0186, 9.1964],
    status: 'Actif',
    capacity: '45 MVA',
    lastInspection: '2023-11-15',
    nextMaintenance: '2024-02-15',
    region: 'Sud-Ouest',
    criticality: 'Haute',
    installationDate: '2020-04-22',
    voltage: 90,
    load: 75,
    alerts: generateRandomAlerts(),
    specifications: {
      bays: 8,
      switchgear: 'GIS',
      backup: 'UPS',
    },
  },
];

export const regions = [
  'Tous', 'Centre', 'Littoral', 'Nord', 'Ouest', 'Est', 'Adamaoua',
  'Extrême-Nord', 'Nord-Ouest', 'Sud', 'Sud-Ouest'
];

export const assetTypes = ['Tous', 'Transformateur', 'Ligne', 'Poste', 'Compteur', 'Générateur'];
export const criticalityLevels = ['Tous', 'Haute', 'Moyenne', 'Faible'];
export const statusOptions = ['Tous', 'Actif', 'En maintenance', 'Hors service', 'En alerte'];
