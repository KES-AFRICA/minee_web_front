import type { Actif } from "@/data";
import { Card, Statistic, Pagination } from "antd";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type CommuneDetailProps = {
    commune: string;
    actifs: Actif[];
    PAGE_SIZE?: number;
};

// const COLORS = [
//     "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6699", "#FF4444", "#00B8D9",
// ];

export default function CommuneDetail({ commune, actifs, PAGE_SIZE = 10 }: CommuneDetailProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Filtrer les actifs de la commune
    const actifsCommune = useMemo(
        () => actifs.filter((a) => a.commune === commune),
        [actifs, commune]
    );

    // Pagination
    const paginated = useMemo(
        () =>
            actifsCommune.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [actifsCommune, currentPage, PAGE_SIZE]
    );

    // KPIs
    const totalActifs = actifsCommune.length;
    const totalValeur = useMemo(
        () => actifsCommune.reduce((sum, a) => sum + (Number(a.valorisation) || 0), 0),
        [actifsCommune]
    );
    const region = actifsCommune[0]?.region || "-";
    const departement = actifsCommune[0]?.departement || "-";

    // Pour la carte : récupérer les actifs avec géolocalisation
    const actifsGeo = actifsCommune.filter(
        (a) => a.geolocalisation?.latitude && a.geolocalisation?.longitude
    );

    // Centrer la carte sur le premier actif géolocalisé ou sur le Cameroun
    const defaultCenter = actifsGeo.length
        ? [actifsGeo[0].geolocalisation!.latitude, actifsGeo[0].geolocalisation!.longitude]
        : [3.848, 11.502]; // Centre du Cameroun

    return (
        <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <Statistic
                        title="Nombre d'actifs"
                        value={totalActifs}
                        valueStyle={{ color: "#0088FE" }}
                    />
                </Card>
                <Card>
                    <Statistic
                        title="VNC (Fcfa)"
                        value={totalValeur}
                        valueStyle={{ color: "#00C49F" }}
                        precision={0}
                        groupSeparator=" "
                    />
                </Card>
                <Card>
                    <Statistic
                        title="Région / Département"
                        value={`${region} / ${departement}`}
                        valueStyle={{ color: "#FF8042", fontSize: 14 }}
                    />
                </Card>
            </div>

            {/* Carte des actifs */}
            <Card title="Carte des actifs de la commune">
                <div className="w-full h-80 rounded overflow-hidden">
                    <MapContainer
                        center={defaultCenter as [number, number]}
                        zoom={12}
                        style={{ width: "100%", height: "100%" }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {actifsGeo.map((a) => (
                            <Marker
                                key={a.id}
                                position={[
                                    a.geolocalisation!.latitude,
                                    a.geolocalisation!.longitude,
                                ]}
                                icon={
                                    new L.Icon({
                                        iconUrl: "/images/point.png",
                                        iconSize: [32, 32],
                                        iconAnchor: [16, 16],
                                        popupAnchor: [0, -16],
                                        className: "custom-marker-icon",
                                    })
                                }
                            >
                                <Popup>
                                    <div>
                                        <img
                                            src={a.photo[0]}
                                            alt={a.type}
                                            style={{ width: "100%", height: "50%", objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                                        />
                                        <strong>{a.designationGenerale}</strong>
                                        <br />
                                        {a.type.replace(/_/g, " ")}
                                        <br />
                                        Lat: {a.geolocalisation!.latitude}
                                        <br />
                                        Lng: {a.geolocalisation!.longitude}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    <style>
                        {`
                            .custom-marker-icon {
                                border: 1px solid #fff;
                                border-radius: 50%;
                                box-sizing: border-box;
                                background: #fff;
                            }
                        `}
                    </style>
                </div>
            </Card>

            {/* Tableau des actifs */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Actifs associés à la commune
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Désignation
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    VNC (Fcfa)
                                </th>
                                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    État visuel
                                </th> */}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date inventaire
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Quartier
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Rue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Aucun actif trouvé dans cette commune
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {a.designationGenerale}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {a.type.replace(/_/g, " ")}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                            {Number(a.valorisation || 0).toLocaleString("fr-FR")}
                                        </td>
                                        {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {a.etatVisuel}
                                        </td> */}
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {a.date}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {a.quartier}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {a.rue}
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
                        total={actifsCommune.length}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </div>
    );
}