// src/store/slices/analyticsSlice.ts
import type { StateCreator } from "zustand";
import type { RootState, ActifAnalytics, DepartAnalytics } from "../types";

export interface AnalyticsSlice {
  // Méthodes analytiques
  getActifStatistics: () => ActifAnalytics;
  getDepartAnalytics: () => DepartAnalytics;
  getMaintenanceReport: () => unknown;
  getValorizationReport: () => unknown;
  getGeneratedStatistics: () => unknown;
  exportFullReport: () => void;
}

// Créateur du slice Analytics
export const createAnalyticsSlice: StateCreator<
  RootState,
  [],
  [],
  AnalyticsSlice
> = (set, get) => ({
  // Méthodes analytiques
  getActifStatistics: (): ActifAnalytics => {
    const { actifs, filteredActifs, selectedActifs } = get();
    const currentYear = new Date().getFullYear();

    const actifsPlusRecents = actifs
      .filter((a) => a.anneeMiseEnService >= 2020)
      .sort((a, b) => b.anneeMiseEnService - a.anneeMiseEnService)
      .slice(0, 10);

    const actifsPlusAnciens = actifs
      .filter((a) => a.anneeMiseEnService < 2010)
      .sort((a, b) => a.anneeMiseEnService - b.anneeMiseEnService)
      .slice(0, 10);

    const actifsDefaillants = actifs.filter(
      (a) => a.etatVisuel === "Mauvais" || a.etatVisuel === "Pourri Critique"
    );

    return {
      total: actifs.length,
      filtered: filteredActifs.length,
      selected: selectedActifs.length,
      parType: actifs.reduce((acc, actif) => {
        acc[actif.type] = (acc[actif.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parRegion: actifs.reduce((acc, actif) => {
        acc[actif.region] = (acc[actif.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parEtat: actifs.reduce((acc, actif) => {
        acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      valorisationTotale: actifs.reduce(
        (sum, actif) => sum + actif.valorisation,
        0
      ),
      valorisationFiltered: filteredActifs.reduce(
        (sum, actif) => sum + actif.valorisation,
        0
      ),
      valorisationSelected: selectedActifs.reduce(
        (sum, actif) => sum + actif.valorisation,
        0
      ),
      moyenneAge:
        actifs.reduce(
          (sum, actif) => sum + (currentYear - actif.anneeMiseEnService),
          0
        ) / actifs.length || 0,
      actifsPlusRecents,
      actifsPlusAnciens,
      actifsDefaillants,
      repartitionAnnuelle: actifs.reduce((acc, actif) => {
        acc[actif.anneeMiseEnService] =
          (acc[actif.anneeMiseEnService] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
    };
  },

  getDepartAnalytics: (): DepartAnalytics => {
    const { departs, filteredDeparts, departConnections } = get();

    return {
      total: departs.length,
      filtered: filteredDeparts.length,
      enService: departs.filter((d) => d.etatGeneral === "En service").length,
      enMaintenance: departs.filter((d) => d.etatGeneral === "Maintenance")
        .length,
      horsService: departs.filter((d) => d.etatGeneral === "Hors service")
        .length,
      longueurTotale: departs.reduce((sum, d) => sum + d.longueurTotale, 0),
      tensionMoyenne:
        departs.reduce((sum, d) => sum + d.tension, 0) / departs.length || 0,
      repartitionParType: departs.reduce((acc, depart) => {
        acc[depart.typeDepart] = (acc[depart.typeDepart] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      repartitionParRegion: departs.reduce((acc, depart) => {
        depart.zonesGeographiques.regions.forEach((region) => {
          acc[region] = (acc[region] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      actifsParDepart: departs.reduce((acc, depart) => {
        acc[depart.nom] = depart.actifs.length;
        return acc;
      }, {} as Record<string, number>),
      connectivite: departConnections.reduce((acc, conn) => {
        acc[conn.connectionType] = (acc[conn.connectionType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      densiteActifs: departConnections.reduce((acc, conn) => {
        const density = conn.actifs.length / (conn.totalLength || 1);
        acc[conn.depart.nom] = density;
        return acc;
      }, {} as Record<string, number>),
    };
  },

  getMaintenanceReport: () => {
    const { actifs } = get();
    const currentYear = new Date().getFullYear();

    return {
      actifsParEtat: actifs.reduce((acc, actif) => {
        acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      maintenancePrioritaire: actifs
        .filter(
          (a) =>
            a.etatVisuel === "Mauvais" ||
            (a.etatVisuel === "Passable" &&
              currentYear - a.anneeMiseEnService > 15)
        )
        .sort((a, b) => b.valorisation - a.valorisation),
      maintenancePreventive: actifs
        .filter(
          (a) =>
            a.etatVisuel === "Bon" && currentYear - a.anneeMiseEnService > 10
        )
        .sort(
          (a, b) =>
            currentYear -
            b.anneeMiseEnService -
            (currentYear - a.anneeMiseEnService)
        ),
      coutEstimeMaintenance: actifs
        .filter((a) => a.etatVisuel !== "Bon")
        .reduce((sum, a) => sum + a.valorisation * 0.1, 0), // 10% de la valorisation
    };
  },

  getValorizationReport: () => {
    const { actifs, departs } = get();

    return {
      valorisationTotale: actifs.reduce((sum, a) => sum + a.valorisation, 0),
      valorisationParType: actifs.reduce((acc, actif) => {
        acc[actif.type] = (acc[actif.type] || 0) + actif.valorisation;
        return acc;
      }, {} as Record<string, number>),
      valorisationParRegion: actifs.reduce((acc, actif) => {
        acc[actif.region] = (acc[actif.region] || 0) + actif.valorisation;
        return acc;
      }, {} as Record<string, number>),
      valorisationParDepart: departs
        .map((depart) => ({
          nom: depart.nom,
          valorisation: depart.actifs.reduce((sum, actifId) => {
            const actif = actifs.find((a) => a.id === actifId);
            return sum + (actif?.valorisation || 0);
          }, 0),
        }))
        .sort((a, b) => b.valorisation - a.valorisation),
      depreciationEstimee: actifs.reduce((sum, actif) => {
        const age = new Date().getFullYear() - actif.anneeMiseEnService;
        const depreciationRate = Math.min(age * 0.05, 0.8); // Max 80% de dépréciation
        return sum + actif.valorisation * depreciationRate;
      }, 0),
    };
  },

  getGeneratedStatistics: () => {
    // Cette fonction récupérerait les statistiques générées par le script
    // Dans ce cas, nous faisons référence à un module d'importation
    try {
      const { statistics } = require("@/data/electrical_data");
      return statistics;
    } catch (error) {
      console.error("Erreur lors de l'accès aux statistiques générées:", error);
      return {};
    }
  },

  exportFullReport: () => {
    const { downloadFile } = require("../utils/exportUtils");
    const actifStats = get().getActifStatistics();
    const departStats = get().getDepartAnalytics();
    const filterInsights = get().getFilterInsights();
    const generatedStats = get().getGeneratedStatistics();

    const fullReport = {
      reportDate: new Date().toISOString(),
      actifAnalytics: actifStats,
      departAnalytics: departStats,
      filterInsights,
      generatedStatistics: generatedStats,
      summary: {
        totalActifs: actifStats.total,
        totalDeparts: departStats.total,
        totalValorisation: actifStats.valorisationTotale,
        actifsEnService: actifStats.total - actifStats.actifsDefaillants.length,
        departsEnService: departStats.enService,
        regionsDesservies: Object.keys(actifStats.parRegion).length,
        typesActifs: Object.keys(actifStats.parType).length,
      },
    };

    const dataStr = JSON.stringify(fullReport, null, 2);
    downloadFile(
      dataStr,
      "application/json",
      `rapport_complet_${new Date().toISOString().split("T")[0]}.json`
    );
  },
});
