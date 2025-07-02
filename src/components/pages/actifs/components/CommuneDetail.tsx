import type { Actif } from "@/data";
import { Card, Statistic, Pagination } from "antd";
import { MapPin, Eye, Navigation } from "lucide-react";
import { useMemo, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import MultiAssetsMap from "./MultiAssetsMap";

type CommuneDetailProps = {
  commune: string;
  actifs: Actif[];
  PAGE_SIZE?: number;
};

export default function CommuneDetail({
  commune,
  actifs,
  PAGE_SIZE = 10,
}: CommuneDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssetId, setSelectedAssetId] = useState<
    string | number | null
  >(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const mapRef = useRef<any>(null);

  // Filtrer les actifs de la commune
  const actifsCommune = useMemo(
    () => actifs.filter((a) => a.commune === commune),
    [actifs, commune]
  );

  // Pagination
  const paginated = useMemo(
    () =>
      actifsCommune.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [actifsCommune, currentPage, PAGE_SIZE]
  );

  // KPIs
  const totalActifs = actifsCommune.length;
  const totalValeur = useMemo(
    () =>
      actifsCommune.reduce((sum, a) => sum + (Number(a.valorisation) || 0), 0),
    [actifsCommune]
  );
  const region = actifsCommune[0]?.region || "-";
  const departement = actifsCommune[0]?.departement || "-";

  // Pour la carte : récupérer les actifs avec géolocalisation
  const actifsGeo = actifsCommune.filter(
    (a) => a.geolocalisation?.latitude && a.geolocalisation?.longitude
  );

  // Centrer la carte sur le premier actif géolocalisé ou sur le Cameroun
  const defaultCenter: [number, number] = actifsGeo.length
    ? [
        actifsGeo[0].geolocalisation!.latitude,
        actifsGeo[0].geolocalisation!.longitude,
      ]
    : [3.848, 11.502]; // Centre du Cameroun

  // Fonction pour centrer la carte sur un actif
  const focusOnAsset = (actif: Actif) => {
    if (actif.geolocalisation?.latitude && actif.geolocalisation?.longitude) {
      setSelectedAssetId(actif.id);
      setMapCenter([
        actif.geolocalisation.latitude,
        actif.geolocalisation.longitude,
      ]);
      setMapZoom(16); // Zoom plus rapproché pour voir l'actif

      // Faire défiler jusqu'à la carte
      const mapElement = document.getElementById("commune-map");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Fonction pour remettre la vue globale
  const resetMapView = () => {
    setSelectedAssetId(null);
    setMapCenter(null);
    setMapZoom(12);
  };

  // Vérifier si un actif est géolocalisé
  const isGeolocalized = (actif: Actif) => {
    return actif.geolocalisation?.latitude && actif.geolocalisation?.longitude;
  };

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
      <Card
        id="commune-map"
        title={
          <div className="flex items-center justify-between">
            <span>Carte des actifs de la commune</span>
            <div className="flex items-center gap-2">
              {selectedAssetId && (
                <>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Actif sélectionné
                  </span>
                  <button
                    onClick={resetMapView}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center gap-1 transition-colors"
                    title="Revenir à la vue globale"
                  >
                    <Eye className="h-4 w-4" />
                    Vue globale
                  </button>
                </>
              )}
              <div className="text-sm text-gray-500">
                {actifsGeo.length}/{totalActifs} géolocalisés
              </div>
            </div>
          </div>
        }
      >
        <MultiAssetsMap
          ref={mapRef}
          actifsGeo={actifsGeo}
          defaultCenter={mapCenter || defaultCenter}
          zoom={mapZoom}
          selectedAssetId={selectedAssetId}
          onAssetSelect={(assetId) => setSelectedAssetId(assetId)}
        />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date inventaire
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quartier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Aucun actif trouvé dans cette commune
                  </td>
                </tr>
              ) : (
                paginated.map((a) => (
                  <tr
                    key={a.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      selectedAssetId === a.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => isGeolocalized(a) && focusOnAsset(a)}
                    title={
                      isGeolocalized(a)
                        ? "Cliquer pour voir sur la carte"
                        : "Actif non géolocalisé"
                    }
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <MapPin
                            className={`h-4 w-4 ${
                              isGeolocalized(a)
                                ? "text-green-500"
                                : "text-gray-300"
                            }`}
                          />
                          {selectedAssetId === a.id && (
                            <div className="ml-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {a.designationGenerale}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {a.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {Number(a.valorisation || 0).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {a.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {a.quartier}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {a.rue}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {isGeolocalized(a) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            focusOnAsset(a);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                          title="Voir sur la carte"
                        >
                          <Navigation className="h-3 w-3" />
                          Localiser
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          <MapPin className="h-3 w-3" />
                          Non géolocalisé
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 p-4 rounded-b-xl border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {actifsGeo.length > 0 && (
              <span className="text-green-600">
                ● {actifsGeo.length} actif(s) disponible(s) sur la carte
              </span>
            )}
          </div>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={actifsCommune.length}
            onChange={(page) => {
              setCurrentPage(page);
              // Réinitialiser la sélection lors du changement de page
              if (selectedAssetId) {
                const selectedAsset = actifsCommune.find(
                  (a) => a.id === selectedAssetId
                );
                const isSelectedAssetOnNewPage = paginated.some(
                  (a) => a.id === selectedAssetId
                );
                if (!isSelectedAssetOnNewPage) {
                  resetMapView();
                }
              }
            }}
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* Instructions utilisateur */}
      {actifsGeo.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Comment utiliser la synchronisation carte-tableau
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>
                  • Cliquez sur une ligne du tableau pour centrer la carte sur
                  cet actif
                </li>
                <li>• Utilisez le bouton "Localiser" pour un focus précis</li>
                <li>
                  • Cliquez sur "Vue globale" pour revenir à la vue d'ensemble
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
