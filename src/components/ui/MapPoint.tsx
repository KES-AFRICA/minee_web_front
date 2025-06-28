import L from "leaflet";

export const createIcon = (iconColor: string) => {
  return L.divIcon({
    html: `
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="${iconColor}" stroke-width="2" fill="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
      </svg>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

