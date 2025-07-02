import { Modal } from "antd";
import { X } from "lucide-react";
import type { Actif } from "@/types";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Accordion } from "@/components/Accordion";

interface ActifDetailsModalProps {
  actif: Actif | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActifDetailsModal({
  actif,
  isOpen,
  onClose,
}: ActifDetailsModalProps) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!actif) return null;

  const photos = Array.isArray(actif.photo) ? actif.photo : [actif.photo];
  const hasMultiplePhotos = photos.length > 1;

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const renderBaseDetails = () => (
    <Accordion title="Détails de base" defaultOpen={true} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <DetailItem label="ID" value={actif.id} />
          <DetailItem label="Date d'inventaire" value={actif.date} />
          <DetailItem label="Région" value={actif.region} />
          <DetailItem label="Département" value={actif.departement} />
          <DetailItem label="Commune" value={actif.commune} />
          <DetailItem label="Quartier" value={actif.quartier} />
          <DetailItem label="Rue" value={actif.rue} />
          {actif.precisionLieu && (
            <DetailItem label="Précision lieu" value={actif.precisionLieu} />
          )}
          <DetailItem
            label="Valorisation actuelle"
            value={`${actif.valorisation} Fcfa`}
          />
          <DetailItem
            label="Valeur d'acquisition"
            value={`${actif.valeurAcquisition} Fcfa`}
          />
          <DetailItem
            label="Année mise en service"
            value={`${actif.anneeMiseEnService}`}
          />
          <DetailItem
            label="Durée de vie estimative"
            value={`${actif.dureeDeVieEstimative} ans`}
          />
          <DetailItem
            label="Taux d'amortissement annuel"
            value={`${actif.tauxAmortissementAnnuel} %`}
          />
        </div>
        <div className="space-y-2">
          <DetailItem
            label="Position matériel"
            value={actif.positionMateriel}
          />
          <DetailItem label="État visuel" value={actif.etatVisuel} />
          <DetailItem label="Numéro immo" value={actif.numeroImmo} />
          {actif.nouveauNumeroImmo && (
            <DetailItem
              label="Nouveau numéro immo"
              value={actif.nouveauNumeroImmo}
            />
          )}
          <DetailItem label="Numéro compte" value={actif.numeroCompte} />
          <DetailItem label="Libellé compte" value={actif.libelleCompte} />
          <DetailItem
            label="Mode d'acquisition"
            value={actif.modeDacquisition}
          />
          <DetailItem label="Type de bien" value={actif.TypeDeBien} />
          <DetailItem label="Nature du bien" value={actif.natureDuBien} />
        </div>
      </div>
    </Accordion>
  );

  const renderSpecificDetails = () => {
    switch (actif.type) {
      case "LIGNE_AERIENNE":
      case "LIGNE_SOUTERRAINE":
        return (
          <Accordion
            title="Détails de base"
            defaultOpen={true}
            className="mb-4"
          >
            <div className="space-y-4">
              <SectionTitle title="Détails de la ligne" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Numéro ligne" value={actif.numeroLigne} />
                <DetailItem label="Origine ligne" value={actif.origineLigne} />
                <DetailItem
                  label="Identification départ"
                  value={actif.identificationDepart}
                />
                <DetailItem label="Tension (V)" value={actif.tension} />
                <DetailItem
                  label="État fonctionnement"
                  value={actif.etatFonctionnement}
                />
                <DetailItem
                  label="Typologie ligne"
                  value={actif.typologieLigne}
                />
                <DetailItem
                  label="Type distribution"
                  value={actif.typeDistribution}
                />
                <DetailItem
                  label="Structure réseau"
                  value={actif.structureReseau}
                />
                <DetailItem label="Type câble" value={actif.typeCable} />
                <DetailItem
                  label="Section conducteur"
                  value={actif.sectionConducteur}
                />
                <DetailItem label="Conducteur" value={actif.conducteur} />
                <DetailItem
                  label="Longueur ligne (m)"
                  value={actif.longueurLigne}
                />
                <DetailItem
                  label="Nombre supports"
                  value={actif.nombreSupports}
                />
              </div>
            </div>
          </Accordion>
        );

      case "POSTE_DISTRIBUTION":
        return (
          <Accordion
            title="Détails de base"
            defaultOpen={true}
            className="mb-4"
          >
            <div className="space-y-4">
              <SectionTitle title="Détails du poste" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Nom poste" value={actif.nomPoste} />
                <DetailItem label="Départ MT" value={actif.departMT} />
                <DetailItem
                  label="Année fabrication"
                  value={actif.anneeFabrication}
                />
                <DetailItem label="Fabricant" value={actif.fabricant} />
                <DetailItem label="Marque" value={actif.marque} />
                <DetailItem label="Type poste" value={actif.typePoste} />
                <DetailItem label="Numéro série" value={actif.numeroSerie} />
                <DetailItem
                  label="Niveau tension"
                  value={actif.niveauTension}
                />
                <DetailItem label="Type montage" value={actif.typeMontage} />
                <DetailItem label="Génie civil" value={actif.genieCivil} />
                <DetailItem label="Dimensions" value={actif.dimensionPoste} />
              </div>
            </div>
          </Accordion>
        );

      case "TRANSFORMATEUR":
        return (
          <Accordion
            title="Détails de base"
            defaultOpen={false}
            className="mb-4"
          >
            <div className="space-y-4">
              <SectionTitle title="Détails du transformateur" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Nom poste" value={actif.nomPoste} />
                <DetailItem label="Départ MT" value={actif.departMT} />
                <DetailItem
                  label="Type transformateur"
                  value={actif.typeTransformateur}
                />
                <DetailItem label="Fabricant" value={actif.fabricant} />
                <DetailItem label="Marque" value={actif.marque} />
                <DetailItem label="Numéro série" value={actif.numeroSerie} />
                <DetailItem label="Puissance (kVA)" value={actif.puissance} />
                <DetailItem
                  label="Tension primaire (V)"
                  value={actif.tensionPrimaire}
                />
                <DetailItem
                  label="Tension secondaire (V)"
                  value={actif.tensionSecondaire}
                />
                <DetailItem
                  label="Type diélectrique"
                  value={actif.dielectrique}
                />
                <DetailItem
                  label="Type refroidissement"
                  value={actif.typeRefroidissement}
                />
                <DetailItem label="Protection MT" value={actif.protectionMT} />
                <DetailItem label="Protection BT" value={actif.protectionBT} />
              </div>
            </div>
          </Accordion>
        );

      case "CELLULE_DISTRIBUTION_PRIMAIRE":
        return (
          <Accordion
            title="Détails de base"
            defaultOpen={false}
            className="mb-4"
          >
            <div className="space-y-4">
              <SectionTitle title="Détails de la cellule primaire" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Nom poste" value={actif.nomPoste} />
                <DetailItem label="Départ MT" value={actif.departMT} />
                <DetailItem label="Type cellule" value={actif.typeCellule} />
                <DetailItem label="Fabricant" value={actif.fabricant} />
                <DetailItem label="Marque" value={actif.marque} />
                <DetailItem label="Numéro série" value={actif.numeroSerie} />
                <DetailItem
                  label="Niveau tension"
                  value={actif.niveauTension}
                />
                <DetailItem label="Tension (V)" value={actif.tension} />
                <DetailItem label="Type relais" value={actif.typeRelais} />
                <DetailItem label="Modèle relais" value={actif.modeleRelais} />
                <DetailItem label="Type montage" value={actif.typeMontage} />
              </div>
              <SectionTitle title="Équipements" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  label="Disjoncteur"
                  value={actif.equipements.disjoncteur ? "Oui" : "Non"}
                />
                <DetailItem
                  label="Interrupteur"
                  value={actif.equipements.interrupteur ? "Oui" : "Non"}
                />
                <DetailItem
                  label="Mesure"
                  value={actif.equipements.mesure ? "Oui" : "Non"}
                />
                <DetailItem
                  label="Protection"
                  value={actif.equipements.protection ? "Oui" : "Non"}
                />
                <DetailItem
                  label="Transformateur"
                  value={actif.equipements.transfo ? "Oui" : "Non"}
                />
              </div>
            </div>
          </Accordion>
        );

      // Ajoutez les autres cas pour les différents types d'actifs
      // ...

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-500">
              Aucun détail spécifique disponible pour ce type d'actif.
            </p>
          </div>
        );
    }
  };

  return (
    <>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
              <SectionTitle title="Géolocalisation" />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64">
                <div className="mt-4 border-1 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center h-full">
                  {actif.geolocalisation?.latitude &&
                  actif.geolocalisation?.longitude ? (
                    <div className="w-full h-60 rounded overflow-hidden">
                      <MapContainer
                        center={[
                          actif.geolocalisation.latitude,
                          actif.geolocalisation.longitude,
                        ]}
                        zoom={15} // Changé de 1 à 15 pour un zoom approprié
                        style={{ width: "100%", height: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            actif.geolocalisation.latitude,
                            actif.geolocalisation.longitude,
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
                        >
                          <Popup>
                            <div className="flex justify-center items-center w-full">
                              <div>
                                <strong>{actif.designationGenerale}</strong>
                                <br />
                                Lat: {actif.geolocalisation.latitude}
                                <br />
                                Lng: {actif.geolocalisation.longitude}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
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
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      Localisation non disponible
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <SectionTitle title="Photo" />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg  h-64 flex items-center justify-center">
                {actif.photo ? (
                  <div
                    className="relative h-full w-full cursor-pointer group"
                    onClick={() => setShowPhotoModal(true)}
                  >
                    <img
                      src={photos[0]}
                      alt={`Photo de ${actif.designationGenerale}`}
                      className="object-contain h-full w-full"
                    />
                    {hasMultiplePhotos && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {photos.length} photos
                      </span>
                    )}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Cliquer pour agrandir
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Aucune photo disponible
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mb-5">
            <SectionTitle title="Etiquette" />
            <div className=" rounded-lg  h-64 flex items-center justify-center">
              {actif.photo ? (
                <div className="relative h-full w-full cursor-pointer group">
                  <img
                    src={photos[photos.length - 1]}
                    alt={`Photo de ${actif.designationGenerale}`}
                    className="object-contain h-full w-full"
                  />
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  Aucune photo disponible
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {actif.designationGenerale}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {actif.type.replace(/_/g, " ")} • {actif.id}
              </p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  "etatFonctionnement" in actif &&
                  actif.etatFonctionnement === "En service"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {"etatFonctionnement" in actif
                  ? actif.etatFonctionnement
                  : "État inconnu"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  actif.etatVisuel === "Bon"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : actif.etatVisuel === "Moyen"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : actif.etatVisuel === "Passable"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {actif.etatVisuel}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <SectionTitle title="Informations générales" />
            {renderBaseDetails()}
          </div>
                <SectionTitle title="Informations spécifique" />
          <div className="mb-8">{renderSpecificDetails()}</div>
        </div>
      </Modal>
      <Modal
        open={showPhotoModal}
        onCancel={() => setShowPhotoModal(false)}
        footer={null}
        width="100%"
        style={{
          top: 0,
          padding: 0,
          margin: 0,
          maxWidth: "100%",
          height: "100vh",
        }}
        bodyStyle={{
          padding: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.9)",
        }}
        closeIcon={<X className="text-white text-lg" />}
        className="[&_.ant-modal-content]:bg-transparent [&_.ant-modal-close]:top-6 [&_.ant-modal-close]:right-6"
      >
        <div className="relative w-full h-full flex justify-center items-center">
          {/* Bouton précédent */}
          {hasMultiplePhotos && (
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 md:left-8 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Image principale */}
          <div className="max-w-[90vw] max-h-[90vh] flex justify-center items-center">
            <img
              src={photos[currentPhotoIndex]}
              alt={`Photo ${currentPhotoIndex + 1} de ${
                actif.designationGenerale
              }`}
              className="object-contain max-h-[90vh] max-w-full rounded shadow-lg"
            />
          </div>

          {/* Bouton suivant */}
          {hasMultiplePhotos && (
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-8 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Indicateur de position */}
          {hasMultiplePhotos && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentPhotoIndex === index ? "bg-white" : "bg-gray-500"
                  }`}
                  aria-label={`Aller à la photo ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Numéro de photo */}
          {hasMultiplePhotos && (
            <div className="absolute top-4 left-0 right-0 text-center text-white text-sm">
              Photo {currentPhotoIndex + 1} sur {photos.length}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

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
  value: string | number | undefined;
}) {
  if (value === undefined) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
        {typeof value === "string" || typeof value === "number" ? value : "-"}
      </dd>
    </div>
  );
}
