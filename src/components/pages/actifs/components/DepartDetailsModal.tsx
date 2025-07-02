import { Modal } from "antd";
import { X } from "lucide-react";
import type { Actif } from "@/types";
import { getActifById, getDepartById } from "@/data";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Accordion } from "@/components/Accordion";
import L from "leaflet";

interface DepartDetailsModalProps {
  departId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepartDetailsModal({
  departId,
  isOpen,
  onClose,
}: DepartDetailsModalProps) {
  if (!departId) return null;

  const depart = getDepartById(departId);
  if (!depart) return null;

  // Trouver le poste d'origine
  const posteOrigine = getActifById(depart.posteOrigine);

  // Trouver tous les actifs associés à ce départ
  const actifsAssocies = depart.actifs
    .map((id) => getActifById(id))
    .filter(Boolean) as Actif[];

  // Statistiques pour ce départ
  const stats = {
    totalActifs: actifsAssocies.length,
    parType: actifsAssocies.reduce((acc, actif) => {
      acc[actif.type] = (acc[actif.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    parEtat: actifsAssocies.reduce((acc, actif) => {
      const etat = "etatVisuel" in actif ? actif.etatVisuel : "Inconnu";
      acc[etat] = (acc[etat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    longueurTotale: depart.longueurTotale,
  };

  const renderBaseDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <DetailItem label="ID" value={depart.id} />
        <DetailItem label="Nom" value={depart.nom} />
        <DetailItem
          label="Date création"
          value={new Date(depart.dateCreation).toLocaleDateString()}
        />
        <DetailItem label="Tension" value={`${depart.tension} V`} />
        <DetailItem
          label="Longueur totale"
          value={`${depart.longueurTotale} km`}
        />
        <DetailItem
          label="VNC (Fcfa)"
          value={depart.valorisation}
        />
        <DetailItem
          label="Valeur d'acquisition-VO (Fcfa)"
          value={depart.valeurAcquisition}
        />
      </div>
      <div className="space-y-2">
        <DetailItem label="Type" value={depart.typeDepart} />
        <DetailItem label="État général" value={depart.etatGeneral} />
        <DetailItem label="Nombre d'actifs" value={depart.actifs.length} />
        <DetailItem
          label="Zones couvertes"
          value={
            <div>
              <div>Régions: {depart.zonesGeographiques.regions.join(", ")}</div>
              <div>
                Départements:{" "}
                {depart.zonesGeographiques.departements.join(", ")}
              </div>
              <div>
                Communes: {depart.zonesGeographiques.communes.join(", ")}
              </div>
              <div>
                Quartiers: {depart.zonesGeographiques.quartiers.join(", ")}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );

  const renderPosteOrigine = () => {
    if (!posteOrigine || posteOrigine.type !== "POSTE_DISTRIBUTION")
      return null;

    return (
      <div className="mb-6">
        <SectionTitle title="Poste d'origine" />
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Nom" value={posteOrigine.nomPoste} />
            <DetailItem label="ID" value={posteOrigine.id} />
            <DetailItem label="Type" value={posteOrigine.typePoste} />
            <DetailItem
              label="Tension"
              value={`${posteOrigine.niveauTension} V`}
            />
            <DetailItem
              label="Localisation"
              value={`${posteOrigine.quartier}, ${posteOrigine.commune}`}
            />
            <DetailItem
              label="VNC (Fcfa)"
              value={posteOrigine.valorisation}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => (
    <div className="mb-6">
      <SectionTitle title="Statistiques" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Actifs"
          value={stats.totalActifs}
          description={`sur ${depart.longueurTotale} km`}
        />
        <StatCard
          title="Types d'actifs"
          value={Object.keys(stats.parType).length}
        />
        {/* <StatCard
          title="États"
          value={Object.keys(stats.parEtat).length}
          description={Object.entries(stats.parEtat).map(([etat, count]) => (
            <div key={etat}>
              {etat}: {count}
            </div>
          ))}
        /> */}
        <StatCard
          title="VNC"
          value={`${depart.valorisation} Fcfa`}
        />
      </div>
    </div>
  );

  const renderActifsAssocies = () => (
    <div className="mb-6">
      <SectionTitle title={`Actifs associés (${actifsAssocies.length})`} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Désignation
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Localisation
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                VNC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {actifsAssocies.map((actif) => (
              <tr
                key={actif.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {actif.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {actif.type.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {actif.designationGenerale}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {actif.quartier}, {actif.commune}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {/* <StatusBadge 
                    status={'etatFonctionnement' in actif ? actif.etatFonctionnement : actif.etatVisuel} 
                  /> */}
                  {actif.valorisation} Fcfa
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: "1200px" }}
      closeIcon={<X className="text-gray-500 hover:text-gray-700" />}
      className="[&_.ant-modal-content]:p-0 [&_.ant-modal-close]:top-4 [&_.ant-modal-close]:right-4"
    >
      <div className="p-6">
        {renderStats()}
        <div className="flex justify-center items-center mb-5">
          <div className="flex flex-col items-center w-full">
            <SectionTitle title="Carte du départ" />
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-80 w-full">
              {/* Carte Leaflet */}
              {/* Carte Leaflet */}
              {posteOrigine &&
              posteOrigine.geolocalisation?.latitude &&
              posteOrigine.geolocalisation?.longitude &&
              actifsAssocies.length > 0 ? (
                <div className="h-full w-full">
                  <MapContainer
                    center={[
                      posteOrigine.geolocalisation.latitude,
                      posteOrigine.geolocalisation.longitude,
                    ]}
                    zoom={13} // Zoom réduit pour voir plus d'éléments
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Marqueur poste d'origine - Style différent */}
                    <Marker
                      position={[
                        posteOrigine.geolocalisation.latitude,
                        posteOrigine.geolocalisation.longitude,
                      ]}
                      icon={
                        new L.Icon({
                          iconUrl: "/images/point.png",
                          iconSize: [38, 38],
                          iconAnchor: [19, 19], // Centré : [width/2, height/2]
                          popupAnchor: [0, -19], // Popup au-dessus de l'icône
                          className: "custom-marker-icon",
                        })
                      }
                      // Vous pouvez ajouter une icône personnalisée ici
                    >
                      <Popup>
                        <div>
                          <strong>Poste d'origine</strong>
                          <br />
                          {posteOrigine.libelleCompte}
                          <br />
                          ID: {posteOrigine.id}
                        </div>
                      </Popup>
                    </Marker>

                    {/* Marqueurs actifs avec vérification renforcée */}
                    {actifsAssocies.map((actif, index) => {
                      const lat = actif.geolocalisation?.latitude;
                      const lng = actif.geolocalisation?.longitude;

                      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                        console.warn(
                          `Actif ${actif.id} a des coordonnées invalides:`,
                          { lat, lng }
                        );
                        return null;
                      }

                      return (
                        <Marker 
                        icon={
                        new L.Icon({
                          iconUrl: "/images/point.png",
                          iconSize: [38, 38],
                          iconAnchor: [19, 19], // Centré : [width/2, height/2]
                          popupAnchor: [0, -19], // Popup au-dessus de l'icône
                          className: "custom-marker-icon",
                        })
                      }
                        key={actif.id} 
                        position={[lat, lng]}>
                          <Popup>
                            <div>
                              <strong>{actif.designationGenerale}</strong>
                              <br />
                              Type: {actif.type.replace(/_/g, " ")}
                              <br />
                              ID: {actif.id}
                              <br />
                              Position dans départ: {index + 1}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}

                    {/* Polyline avec vérifications et debugging */}
                    {(() => {
                      // Filtrer les actifs avec coordonnées valides
                      const actifsAvecCoordonnees = actifsAssocies.filter(
                        (actif) => {
                          const lat = actif.geolocalisation?.latitude;
                          const lng = actif.geolocalisation?.longitude;
                          return lat && lng && !isNaN(lat) && !isNaN(lng);
                        }
                      );

                      console.log(
                        `Actifs avec coordonnées valides: ${actifsAvecCoordonnees.length}/${actifsAssocies.length}`
                      );

                      if (actifsAvecCoordonnees.length < 2) {
                        console.warn(
                          "Pas assez d'actifs avec coordonnées pour tracer une ligne"
                        );
                        return null;
                      }

                      // Créer les positions pour la polyline
                      const positions = actifsAvecCoordonnees.map(
                        (actif) =>
                          [
                            actif.geolocalisation.latitude,
                            actif.geolocalisation.longitude,
                          ] as [number, number]
                      );

                      console.log("Positions pour polyline:", positions);

                      return (
                        <Polyline
                          positions={positions}
                          pathOptions={{
                            color: "blue",
                            weight: 4,
                            opacity: 0.8,
                            dashArray: undefined, // Ligne continue
                          }}
                        />
                      );
                    })()}

                    {/* Ligne entre poste d'origine et premier actif */}
                    {(() => {
                      const firstActif = actifsAssocies.find((actif) => {
                        const lat = actif.geolocalisation?.latitude;
                        const lng = actif.geolocalisation?.longitude;
                        return lat && lng && !isNaN(lat) && !isNaN(lng);
                      });

                      if (!firstActif) {
                        console.warn(
                          "Aucun premier actif trouvé avec coordonnées valides"
                        );
                        return null;
                      }

                      const connectionLine = [
                        [
                          posteOrigine.geolocalisation.latitude,
                          posteOrigine.geolocalisation.longitude,
                        ],
                        [
                          firstActif.geolocalisation.latitude,
                          firstActif.geolocalisation.longitude,
                        ],
                      ] as [number, number][];

                      console.log("Ligne de connexion:", connectionLine);

                      return (
                        <Polyline
                          positions={connectionLine}
                          pathOptions={{
                            color: "red", // Changé en rouge pour le distinguer
                            dashArray: "10, 10",
                            weight: 3,
                            opacity: 0.7,
                          }}
                        />
                      );
                    })()}
                  </MapContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Données de géolocalisation insuffisantes
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Poste: {posteOrigine ? "OK" : "Manquant"} | Actifs:{" "}
                      {actifsAssocies.length} | Avec coordonnées:{" "}
                      {
                        actifsAssocies.filter(
                          (a) =>
                            a.geolocalisation?.latitude &&
                            a.geolocalisation?.longitude
                        ).length
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {depart.nom}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Départ {depart.typeDepart} • ID: {depart.id}
            </p>
          </div>
          <StatusBadge status={depart.etatGeneral} label="État général" large />
        </div>

        <div className="mb-8">
          <SectionTitle title="Informations générales" />
          <Accordion
            title="Détails de base"
            defaultOpen={false}
            className="mb-4"
          >
            {renderBaseDetails()}
          </Accordion>
        </div>

        {renderPosteOrigine()}
        {renderActifsAssocies()}
      </div>
    </Modal>
  );
}

// Composants utilitaires
function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      {title}
    </h3>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === undefined || value === null) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
        {value || "-"}
      </dd>
    </div>
  );
}

function StatusBadge({
  status,
  label,
  large,
}: {
  status?: string;
  label?: string;
  large?: boolean;
}) {
  if (!status) return null;

  const getStatusClass = () => {
    switch (status) {
      case "Bon":
      case "En service":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Moyen":
      case "Mauvais":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`${
        large ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
      } rounded-full font-medium ${getStatusClass()}`}
    >
      {label ? `${label}: ` : ""}
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-green-200 dark:border-green-800 ">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h4>
      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      {description && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
    </div>
  );
}
