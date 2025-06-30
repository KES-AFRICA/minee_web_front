import React from 'react';
import { MapPin, Activity } from 'lucide-react';

interface MapHeaderProps {
    assetCount: number;
}

const MapHeader: React.FC<MapHeaderProps> = ({ assetCount }) => {
    return (
        
        <div className="bg-white dark:bg-gray-800 shadow-md p-4 z-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="text-teal-600 dark:text-teal-400" />
                        Cartographie des Actifs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Visualisation géographique du réseau électrique
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        {assetCount} actifs
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapHeader;