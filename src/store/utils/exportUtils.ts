// src/store/utils/exportUtils.ts
import type { Actif } from "@/types";
import { calculateAge } from "./calculationUtils";

/**
 * Convertit un tableau d'actifs en format CSV
 */
export const convertToCSV = (data: Actif[]): string => {
  if (data.length === 0) return "";

  const headers = [
    "ID",
    "Type",
    "Désignation",
    "Région",
    "Département",
    "Commune",
    "Quartier",
    "État Visuel",
    "Position Matériel",
    "Année Mise en Service",
    "Latitude",
    "Longitude",
    "Numéro Immo",
    "Numéro Compte",
    "Mode Acquisition",
    "Type de Bien",
    "Nature du Bien",
    "Valorisation",
    "Valeur Acquisition",
    "Âge (années)",
    "Taux Amortissement",
    "Durée de vie estimée",
  ];

  const currentYear = new Date().getFullYear();
  const rows = data.map((actif) => [
    actif.id,
    actif.type,
    actif.designationGenerale,
    actif.region,
    actif.departement,
    actif.commune || "",
    actif.quartier || "",
    actif.etatVisuel,
    actif.positionMateriel,
    actif.anneeMiseEnService,
    actif.geolocalisation.latitude,
    actif.geolocalisation.longitude,
    actif.numeroImmo,
    actif.numeroCompte,
    actif.modeDacquisition,
    actif.TypeDeBien,
    actif.natureDuBien,
    actif.valorisation,
    actif.valeurAcquisition || "",
    currentYear - actif.anneeMiseEnService,
    actif.tauxAmortissementAnnuel || "",
    actif.dureeDeVieEstimative || "",
  ]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
};

/**
 * Convertit un tableau d'actifs en format Excel (HTML)
 */
export const convertToExcel = (data: Actif[]): string => {
  const headers = [
    "ID",
    "Type",
    "Désignation",
    "Région",
    "Département",
    "Commune",
    "Quartier",
    "État Visuel",
    "Position Matériel",
    "Année Mise en Service",
    "Latitude",
    "Longitude",
    "Numéro Immo",
    "Numéro Compte",
    "Mode Acquisition",
    "Type de Bien",
    "Nature du Bien",
    "Valorisation",
    "Valeur Acquisition",
    "Âge (années)",
    "Taux Amortissement (%)",
    "Durée de vie estimée (années)",
  ];

  let html = '<table border="1"><tr>';
  headers.forEach((header) => {
    html += `<th style="background-color: #f0f0f0; font-weight: bold; padding: 5px;">${header}</th>`;
  });
  html += "</tr>";

  const currentYear = new Date().getFullYear();
  data.forEach((actif, index) => {
    const rowColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
    html += `<tr style="background-color: ${rowColor};">`;
    [
      actif.id,
      actif.type,
      actif.designationGenerale,
      actif.region,
      actif.departement,
      actif.commune || "",
      actif.quartier || "",
      actif.etatVisuel,
      actif.positionMateriel,
      actif.anneeMiseEnService,
      actif.geolocalisation.latitude,
      actif.geolocalisation.longitude,
      actif.numeroImmo,
      actif.numeroCompte,
      actif.modeDacquisition,
      actif.TypeDeBien,
      actif.natureDuBien,
      actif.valorisation,
      actif.valeurAcquisition || "",
      currentYear - actif.anneeMiseEnService,
      actif.tauxAmortissementAnnuel || "",
      actif.dureeDeVieEstimative || "",
    ].forEach((cell) => {
      html += `<td style="padding: 3px; border: 1px solid #ddd;">${String(
        cell
      )}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  return html;
};

/**
 * Convertit un tableau d'actifs en format JSON avec métadonnées
 */
export const convertToJSON = (
  data: Actif[],
  metadata: Record<string, any> = {}
): string => {
  const jsonData = {
    actifs: data,
    metadata: {
      exportDate: new Date().toISOString(),
      totalCount: data.length,
      totalValorisation: data.reduce((sum, a) => sum + a.valorisation, 0),
      ...metadata,
    },
  };

  return JSON.stringify(jsonData, null, 2);
};

/**
 * Télécharge un fichier
 */
export const downloadFile = (
  dataStr: string,
  mimeType: string,
  fileName: string
): void => {
  const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", fileName);
  linkElement.style.display = "none";
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
};

/**
 * Exporte les données en différents formats
 */
export const exportData = (
  data: Actif[],
  format: "csv" | "json" | "excel",
  fileName: string,
  metadata: Record<string, any> = {}
): void => {
  if (data.length === 0) return;

  let dataStr: string;
  let mimeType: string;
  let fullFileName: string;

  switch (format) {
    case "csv":
      dataStr = convertToCSV(data);
      mimeType = "text/csv";
      fullFileName = `${fileName}.csv`;
      break;
    case "json":
      dataStr = convertToJSON(data, metadata);
      mimeType = "application/json";
      fullFileName = `${fileName}.json`;
      break;
    case "excel":
      dataStr = convertToExcel(data);
      mimeType = "application/vnd.ms-excel";
      fullFileName = `${fileName}.xls`;
      break;
    default:
      return;
  }

  downloadFile(dataStr, mimeType, fullFileName);
};
