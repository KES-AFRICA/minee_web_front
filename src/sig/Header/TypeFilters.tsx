import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

// Configuration des types d'actifs
export const types = [
    {
        value: "LIGNE_AERIENNE",
        label: "Ligne Aérienne",
        icon: "⚡",
        color: "text-blue-600",
    },
    {
        value: "LIGNE_SOUTERRAINE",
        label: "Ligne Souterraine",
        icon: "🔌",
        color: "text-purple-600",
    },
    {
        value: "TRANSFORMATEUR",
        label: "Transformateur",
        icon: "⚙️",
        color: "text-red-600",
    },
    {
        value: "POSTE_DISTRIBUTION",
        label: "Poste Distribution",
        icon: "🏢",
        color: "text-green-600",
    },
    {
        value: "SUPPORT",
        label: "Support",
        icon: "📡",
        color: "text-orange-600",
    },
    {
        value: "OCR",
        label: "OCR",
        icon: "🔄",
        color: "text-red-700",
    },
    {
        value: "TABLEAU_BT",
        label: "Tableau BT",
        icon: "📋",
        color: "text-indigo-600",
    },
    {
        value: "CELLULE_DISTRIBUTION_SECONDAIRE",
        label: "Cellule Distribution Secondaire",
        icon: "🔗",
        color: "text-teal-600",
    },
    {
        value: "CELLULE_DISTRIBUTION_PRIMAIRE",
        label: "Cellule Distribution Primaire",
        icon: "🔗",
        color: "text-cyan-600",
    },
    {
        value: "POINT_LIVRAISON",
        label: "Point Livraison",
        icon: "📍",
        color: "text-pink-600",
    },
    {
        value: "EQUIPEMENT_STOCK",
        label: "Équipement Stock",
        icon: "📦",
        color: "text-amber-600",
    },
];

interface TypeFiltersProps {
    selectedDepart?: string | null;
    setSelectedDepart?: (depart: string | null) => void;
}

export const TypeFilters: React.FC<TypeFiltersProps> = ({
    selectedDepart,
    setSelectedDepart
}) => {
    const { filters, updateFilters, resetFilters } = useAppStore();

    const handleMultiSelectFilter = (filterKey: keyof typeof filters, value: string) => {
        const currentValues = filters[filterKey] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        updateFilters({ [filterKey]: newValues });
    };

    const clearAllFilters = () => {
        resetFilters();
    };

    const hasActiveFilters = () => {
        return (
            filters.types.length > 0 ||
            filters.regions.length > 0 ||
            filters.etatsVisuels.length > 0 ||
            filters.etatsFonctionnement.length > 0 ||
            selectedDepart
        );
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                    {types.map((type) => (
                        <label
                            key={type.value}
                            className="flex items-center group cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={filters.types.includes(type.value as any)}
                                onChange={() => handleMultiSelectFilter("types", type.value)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                                <span className={`mr-2 ${type.color}`}>{type.icon}</span>
                                {type.label}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters() && (
                    <button
                        onClick={() => {
                            clearAllFilters();
                            setSelectedDepart?.(null);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1 ml-4"
                    >
                        <X className="w-4 h-4" />
                        <span>Effacer tous les filtres</span>
                    </button>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters() && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {filters.types.map((typeValue: React.Key | null | undefined) => {
                        const type = types.find(t => t.value === typeValue);
                        return type ? (
                            <span
                                key={typeValue}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                <span className={`mr-1 ${type.color}`}>{type.icon}</span>
                                {type.label}
                                <button
                                    onClick={() => handleMultiSelectFilter("types", typeValue)}
                                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};