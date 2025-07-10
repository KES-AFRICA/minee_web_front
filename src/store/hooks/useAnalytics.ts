// src/store/hooks/useAnalytics.ts
import { useMapStore } from "../mapStore";
import type { ActifAnalytics, DepartAnalytics } from "../types";

/**
 * Hook personnalisé qui encapsule toutes les fonctionnalités liées aux analytiques
 */
export const useAnalytics = () => {
  // Sélecteur pour les états et actions liés aux analytiques
  const {
    // Méthodes d'analyse
    getActifStatistics,
    getDepartAnalytics,
    getMaintenanceReport,
    getValorizationReport,
    getGeneratedStatistics,
    exportFullReport,

    // État d'affichage des analytiques
    showAnalytics,
    setShowAnalytics,

    // Accès aux données pour calcul
    actifs,
    filteredActifs,
    selectedActifs,
    departs,
    filteredDeparts,
  } = useMapStore();

  // Obtenir les statistiques actuelles
  const actifStats: ActifAnalytics = getActifStatistics();
  const departStats: DepartAnalytics = getDepartAnalytics();
  const maintenanceReport: MaintenanceReport = getMaintenanceReport();
  const valorizationReport: ValorizationReport = getValorizationReport();

  // Calculer des indicateurs clés de performance
  const kpis = {
    // Actifs
    totalActifs: actifs.length,
    actifsFiltres: filteredActifs.length,
    actifsSelectionnes: selectedActifs.length,
    tauxActifsEnBonEtat: actifStats.parEtat["Bon"]
      ? (actifStats.parEtat["Bon"] / actifStats.total) * 100
      : 0,
    tauxActifsCritiques:
      (actifStats.actifsDefaillants.length / actifStats.total) * 100,
    valorisationMoyenne: actifStats.valorisationTotale / actifStats.total,
    ageMoyen: actifStats.moyenneAge,

    // Départs
    totalDeparts: departs.length,
    departsFiltres: filteredDeparts.length,
    tauxDepartsEnService: (departStats.enService / departStats.total) * 100,
    longueurMoyenne: departStats.longueurTotale / departStats.total,

    // Maintenance
    coutMaintenanceTotal: maintenanceReport.coutEstimeMaintenance,
    nombreActifsMaintenancePrioritaire:
      maintenanceReport.maintenancePrioritaire.length,

    // Valorisation
    valorisationTotale: valorizationReport.valorisationTotale,
    depreciationTotale: valorizationReport.depreciationEstimee,
    valeurNetteComptable:
      valorizationReport.valorisationTotale -
      valorizationReport.depreciationEstimee,
  };

  return {
    // État d'affichage
    showAnalytics,
    setShowAnalytics,

    // Statistiques
    actifStats,
    departStats,
    maintenanceReport,
    valorizationReport,
    kpis,

    // Méthodes d'analyse
    getActifStatistics,
    getDepartAnalytics,
    getMaintenanceReport,
    getValorizationReport,
    getGeneratedStatistics,
    exportFullReport,

    // Méthodes utilitaires
    getTopTypesParValorisation: (limit = 5) =>
      Object.entries(valorizationReport.valorisationParType)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit),

    getTopRegionsParActifs: (limit = 5) =>
      Object.entries(actifStats.parRegion)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit),

    getTopDepartsByValorisationTotale: (limit = 5) =>
      valorizationReport.valorisationParDepart.slice(0, limit),

    calculerTauxRenouvellement: () => {
      // Calculer le taux de renouvellement des actifs (nouveaux vs anciens)
      const actifsMoinsDe5Ans = actifs.filter(
        (a) => new Date().getFullYear() - a.anneeMiseEnService <= 5
      ).length;

      return (actifsMoinsDe5Ans / actifs.length) * 100;
    },

    calculerRatioValeurVsEtat: () => {
      // Analyser la relation entre la valorisation et l'état des actifs
      const etatValorisation = {
        Bon: actifs
          .filter((a) => a.etatVisuel === "Bon")
          .reduce((sum, a) => sum + a.valorisation, 0),
        Moyen: actifs
          .filter((a) => a.etatVisuel === "Moyen")
          .reduce((sum, a) => sum + a.valorisation, 0),
        Passable: actifs
          .filter((a) => a.etatVisuel === "Passable")
          .reduce((sum, a) => sum + a.valorisation, 0),
        Mauvais: actifs
          .filter((a) => a.etatVisuel === "Mauvais")
          .reduce((sum, a) => sum + a.valorisation, 0),
        "Pourri Critique": actifs
          .filter((a) => a.etatVisuel === "Pourri Critique")
          .reduce((sum, a) => sum + a.valorisation, 0),
      };

      return etatValorisation;
    },

    genererRapportComplet: () => {
      // Générer un rapport complet avec toutes les analyses
      const rapport = {
        dateGeneration: new Date().toISOString(),
        actifs: {
          statistiques: actifStats,
          distribution: {
            parType: actifStats.parType,
            parRegion: actifStats.parRegion,
            parEtat: actifStats.parEtat,
            parAnnee: actifStats.repartitionAnnuelle,
          },
          valorisation: {
            totale: actifStats.valorisationTotale,
            moyenne: actifStats.valorisationTotale / actifStats.total,
            parType: valorizationReport.valorisationParType,
          },
        },
        departs: {
          statistiques: departStats,
          distribution: {
            parType: departStats.repartitionParType,
            parRegion: departStats.repartitionParRegion,
          },
          connectivite: departStats.connectivite,
        },
        maintenance: maintenanceReport,
        indicateursPerformance: kpis,
      };

      return rapport;
    },
  };
};
