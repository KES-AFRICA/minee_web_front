import type {Asset, AssetType, AssetStatus} from "@/types/AssetType.ts";

// Fake asset data
const generateFakeAssets = (): Asset[] => {
    const types: AssetType[] = ['Transformateur', 'Ligne', 'Poste', 'Compteur', 'Générateur'];
    const statuses: AssetStatus[] = ['Actif', 'En maintenance', 'Hors service', 'En alerte'];
    const regions = ['Nord', 'Sud', 'Est', 'Ouest', 'Centre'];
    const criticalities = ['Haute', 'Moyenne', 'Faible'] as const;

    const assets: Asset[] = [];

    for (let i = 1; i <= 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const criticality = criticalities[Math.floor(Math.random() * criticalities.length)];

        // Generate coordinates around France
        const lat = 46.0 + (Math.random() - 0.5) * 8;
        const lng = 2.0 + (Math.random() - 0.5) * 8;

        assets.push({
            id: `asset-${i}`,
            name: `${type} ${region}-${i.toString().padStart(3, '0')}`,
            type,
            position: [lat, lng],
            status,
            region,
            criticality,
            capacity: type === 'Transformateur' ? `${Math.floor(Math.random() * 500) + 100}kVA` : undefined,
            length: type === 'Ligne' ? `${Math.floor(Math.random() * 50) + 5}km` : undefined,
            lastInspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            nextMaintenance: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
            installationDate: new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
            temperature: type === 'Transformateur' ? Math.floor(Math.random() * 40) + 20 : undefined,
            load: Math.floor(Math.random() * 100),
            voltage: type !== 'Ligne' ? Math.floor(Math.random() * 400) + 220 : undefined,
            description: `${type} installé dans la région ${region}`,
            technician: `Technicien ${Math.floor(Math.random() * 10) + 1}`,
            specifications: {
                manufacturer: ['Schneider', 'ABB', 'Siemens', 'GE'][Math.floor(Math.random() * 4)],
                model: `Model-${Math.floor(Math.random() * 100) + 1}`,
                serialNumber: `SN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                weight: `${Math.floor(Math.random() * 500) + 100}kg`,
                warrantyEnd: new Date(Date.now() + Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        });
    }

    return assets;
};

const fakeAssets = generateFakeAssets();

class AssetService {
    private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async getAssets(): Promise<Asset[]> {
        await this.delay(800);
        return [...fakeAssets];
    }

    async getAssetById(id: string): Promise<Asset | null> {
        await this.delay(500);
        return fakeAssets.find(asset => asset.id === id) || null;
    }

    async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
        await this.delay(1000);
        const newAsset: Asset = {
            ...asset,
            id: `asset-${Date.now()}`
        };
        fakeAssets.push(newAsset);
        return newAsset;
    }

    async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
        await this.delay(800);
        const index = fakeAssets.findIndex(asset => asset.id === id);
        if (index === -1) {
            throw new Error('Asset not found');
        }
        fakeAssets[index] = { ...fakeAssets[index], ...updates };
        return fakeAssets[index];
    }

    async deleteAsset(id: string): Promise<void> {
        await this.delay(600);
        const index = fakeAssets.findIndex(asset => asset.id === id);
        if (index === -1) {
            throw new Error('Asset not found');
        }
        fakeAssets.splice(index, 1);
    }

    async searchAssets(query: string): Promise<Asset[]> {
        await this.delay(400);
        const lowercaseQuery = query.toLowerCase();
        return fakeAssets.filter(asset =>
            asset.name.toLowerCase().includes(lowercaseQuery) ||
            asset.type.toLowerCase().includes(lowercaseQuery) ||
            asset.region.toLowerCase().includes(lowercaseQuery)
        );
    }

    async getAssetsByRegion(region: string): Promise<Asset[]> {
        await this.delay(600);
        return fakeAssets.filter(asset => asset.region === region);
    }

    async getAssetsByType(type: AssetType): Promise<Asset[]> {
        await this.delay(600);
        return fakeAssets.filter(asset => asset.type === type);
    }
}

export const assetService = new AssetService();