// src/store/utils/calculationUtils.ts

/**
 * Calcule la distance entre deux points géographiques en kilomètres
 */
export const calculateDistance = (
  pos1: { latitude: number; longitude: number },
  pos2: { latitude: number; longitude: number }
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
  const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.latitude * Math.PI) / 180) *
      Math.cos((pos2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calcule la moyenne d'un ensemble de valeurs numériques
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

/**
 * Calcule l'âge d'un actif en années
 */
export const calculateAge = (yearOfCommissioning: number): number => {
  return new Date().getFullYear() - yearOfCommissioning;
};

/**
 * Calcule la dépréciation d'un actif
 */
export const calculateDepreciation = (
  valorisation: number,
  yearOfCommissioning: number,
  annualDepreciationRate: number
): number => {
  const age = calculateAge(yearOfCommissioning);
  const depreciationRate = Math.min(age * (annualDepreciationRate / 100), 0.8); // Max 80% de dépréciation
  return valorisation * depreciationRate;
};

/**
 * Calcule la valeur actuelle d'un actif
 */
export const calculateCurrentValue = (
  acquisitionValue: number,
  yearOfCommissioning: number,
  annualDepreciationRate: number
): number => {
  const age = calculateAge(yearOfCommissioning);
  const depreciationRate = Math.min(age * (annualDepreciationRate / 100), 0.8); // Max 80% de dépréciation
  return acquisitionValue * (1 - depreciationRate);
};
