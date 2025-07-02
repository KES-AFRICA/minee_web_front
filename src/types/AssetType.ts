export type AssetType = 'Transformateur' | 'Ligne' | 'Poste' | 'Compteur' | 'Générateur';

export type AssetStatus = 'Actif' | 'En maintenance' | 'Hors service' | 'En alerte';

export type Asset = {
    id: string;
    name: string;
    type: AssetType;
    position: [number, number];
    status: AssetStatus;
    capacity?: string;
    length?: string;
    lastInspection: string;
    nextMaintenance: string;
    region: string;
    criticality: 'Haute' | 'Moyenne' | 'Faible';
    installationDate: string;
    temperature?: number;
    load?: number;
    voltage?: number;
    alerts?: Alert[];
    specifications?: Record<string, string | number | boolean>;
    description?: string;
    technician?: string;
    maintenanceHistory?: MaintenanceRecord[];
    performanceMetrics?: PerformanceMetrics;
};

export type Alert = {
    id: string;
    assetId: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
    severity: 'high' | 'medium' | 'low';
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: string;
    category?: 'maintenance' | 'performance' | 'security' | 'environmental';
};

export type User = {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'manager' | 'technician' | 'viewer';
    name: string;
    avatar?: string;
    region?: string;
    lastLogin: string;
    createdAt: string;
    permissions: string[];
    preferences?: UserPreferences;
    isOnline?: boolean;
};

export type UserPreferences = {
    theme: 'light' | 'dark' | 'auto';
    language: 'fr' | 'en';
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    dashboard: {
        layout: 'grid' | 'list';
        widgets: string[];
    };
};

export type MaintenanceRecord = {
    id: string;
    date: string;
    type: 'preventive' | 'corrective' | 'emergency';
    description: string;
    technician: string;
    duration: number;
    cost?: number;
    parts?: string[];
    status: 'completed' | 'in_progress' | 'scheduled';
};

export type PerformanceMetrics = {
    efficiency: number;
    uptime: number;
    lastUpdate: string;
    trends: {
        efficiency: number[];
        uptime: number[];
        dates: string[];
    };
};

export type FilterState = {
    type: string;
    region: string;
    criticality: string;
    status: string;
    dateRange: {
        start: string;
        end: string;
    };
    search: string;
    technician?: string;
    maintenanceStatus?: string;
};

export type MapViewState = {
    showHeatmap: boolean;
    showClusters: boolean;
    showMeasurements: boolean;
    selectedAssets: string[];
    compareMode: boolean;
    center: [number, number];
    zoom: number;
    layerFilters: {
        showActive: boolean;
        showMaintenance: boolean;
        showAlerts: boolean;
        showOffline: boolean;
    };
};

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};

export type DashboardStats = {
    totalAssets: number;
    activeAssets: number;
    criticalAlerts: number;
    maintenanceDue: number;
    regions: number;
    uptime: number;
    efficiency: number;
    costSavings: number;
};

export type NotificationSettings = {
    email: boolean;
    push: boolean;
    sms: boolean;
    categories: {
        maintenance: boolean;
        alerts: boolean;
        reports: boolean;
        system: boolean;
    };
};

export type ReportType = 'performance' | 'maintenance' | 'alerts' | 'financial' | 'compliance';

export type Report = {
    id: string;
    type: ReportType;
    title: string;
    description: string;
    generatedAt: string;
    generatedBy: string;
    format: 'pdf' | 'excel' | 'csv';
    status: 'generating' | 'ready' | 'failed';
    downloadUrl?: string;
    parameters: Record<string, any>;
};