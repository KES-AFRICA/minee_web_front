import type { Actif } from "@/data";
import { Modal, Pagination } from "antd";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import CommuneDetail from "./CommuneDetail";

type CommuneGroup = {
    commune: string;
    region: string;
    departement: string;
    actifs: Actif[];
    totalValeur: number;
};

function groupByCommune(actifs: Actif[]): CommuneGroup[] {
    const map = new Map<string, CommuneGroup>();
    for (const actif of actifs) {
        const key = actif.commune;
        if (!map.has(key)) {
            map.set(key, {
                commune: actif.commune,
                region: actif.region,
                departement: actif.departement,
                actifs: [],
                totalValeur: 0,
            });
        }
        const group = map.get(key)!;
        group.actifs.push(actif);
        group.totalValeur += Number(actif.valorisation) || 0;
    }
    return Array.from(map.values());
}

export default function CommuneTable({
    actifs,
    PAGE_SIZE = 10,
}: {
    actifs: Actif[];
    PAGE_SIZE?: number;
}) {
     const [currentPage, setCurrentPage] = useState(1);
    const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const grouped = useMemo(() => groupByCommune(actifs), [actifs]);
    const paginated = useMemo(
        () =>
            grouped.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [grouped, currentPage, PAGE_SIZE]
    );

    const handleRowClick = (commune: string) => {
        setSelectedCommune(commune);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCommune(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Commune
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Région
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Département
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Nombre d'actifs
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Valeur totale (Fcfa)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Aucune commune trouvée
                                </td>
                            </tr>
                        ) : (
                            paginated.map((group) => (
                                <tr 
                                onClick={() => handleRowClick(group.commune)}
                                key={group.commune} 
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-gray-700">
                                            <MapPin className="h-4 w-4 text-green-500 dark:text-gray-300" />
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {group.commune}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {group.region}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {group.departement}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                                        {group.actifs.length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        {group.totalValeur.toLocaleString("fr-FR")}
                                    </td>
                                </tr>
                            ))
                        )}
                        <Modal
                            title={`Détails de la commune: ${selectedCommune}`}
                            open={isModalOpen}
                            onCancel={handleCloseModal}
                            footer={null}
                            width="90%"
                            style={{ maxWidth: 1200 }}
                        >
                            {selectedCommune && (
                                <CommuneDetail 
                                    commune={selectedCommune} 
                                    actifs={actifs} 
                                />
                            )}
                        </Modal>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4 p-4 rounded-b-xl border-t border-gray-200">
                <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={grouped.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}