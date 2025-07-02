import type { Actif } from "@/data";
import { Pagination, Card, Statistic } from "antd";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import {

PieChart,
Pie,
Cell,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
Legend,
} from "recharts";

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

const COLORS = [
"#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6699", "#FF4444", "#00B8D9",
];

export default function CommuneDashboard({
actifs,
PAGE_SIZE = 10,
}: {
actifs: Actif[];
PAGE_SIZE?: number;
}) {
const [currentPage, setCurrentPage] = useState(1);

const grouped = useMemo(() => groupByCommune(actifs), [actifs]);
const paginated = useMemo(
    () =>
        grouped.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [grouped, currentPage, PAGE_SIZE]
);

// KPIs
const totalActifs = actifs.length;
const totalValeur = useMemo(
    () => actifs.reduce((sum, a) => sum + (Number(a.valorisation) || 0), 0),
    [actifs]
);
const totalCommunes = grouped.length;

// Pie data: répartition des actifs par commune
const pieData = grouped.map((g) => ({
    name: g.commune,
    value: g.actifs.length,
}));

// Bar data: top 5 communes par valeur totale
const barData = [...grouped]
    .sort((a, b) => b.totalValeur - a.totalValeur)
    .slice(0, 5)
    .map((g) => ({
        name: g.commune,
        valeur: g.totalValeur,
    }));

return (
    <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <Statistic
                    title="Nombre total d'actifs"
                    value={totalActifs}
                    valueStyle={{ color: "#0088FE" }}
                />
            </Card>
            <Card>
                <Statistic
                    title="Valeur totale (Fcfa)"
                    value={totalValeur}
                    valueStyle={{ color: "#00C49F" }}
                    precision={0}
                    groupSeparator=" "
                />
            </Card>
            <Card>
                <Statistic
                    title="Nombre de communes"
                    value={totalCommunes}
                    valueStyle={{ color: "#FF8042" }}
                />
            </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <Card title="Répartition des actifs par commune">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {pieData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            {/* Bar Chart */}
            <Card title="Top 5 communes par valeur totale">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(v: number) => v.toLocaleString("fr-FR")} />
                        <Bar dataKey="valeur" fill="#0088FE" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>

        {/* Table */}
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
                                <tr key={group.commune} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
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
    </div>
);
}