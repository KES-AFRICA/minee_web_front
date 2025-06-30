import React from 'react';
import { Filter, MapPin, AlertTriangle } from 'lucide-react';

interface FiltersProps {
    selectedType: string;
    setSelectedType: (value: string) => void;
    selectedRegion: string;
    setSelectedRegion: (value: string) => void;
    selectedCriticality: string;
    setSelectedCriticality: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
    selectedType,
    setSelectedType,
    selectedRegion,
    setSelectedRegion,
    selectedCriticality,
    setSelectedCriticality,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
                <Filter className="text-gray-500 dark:text-gray-400" />
                <select
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="Tous">Tous les types</option>
                    <option value="Transformateur">Transformateurs</option>
                    <option value="Ligne">Lignes</option>
                    <option value="Poste">Postes</option>
                    <option value="Compteur">Compteurs</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <MapPin className="text-gray-500 dark:text-gray-400" />
                <select
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                >
                    <option value="Tous">Toutes les régions</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Centre">Centre</option>
                    <option value="Nord">Nord</option>
                    <option value="Sud">Sud</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <AlertTriangle className="text-gray-500 dark:text-gray-400" />
                <select
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                    value={selectedCriticality}
                    onChange={(e) => setSelectedCriticality(e.target.value)}
                >
                    <option value="Tous">Toutes criticités</option>
                    <option value="Haute">Haute criticité</option>
                    <option value="Moyenne">Moyenne criticité</option>
                    <option value="Basse">Basse criticité</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;