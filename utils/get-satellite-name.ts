import { Pass } from "@/models/pass.model";

export const getSatelliteName = ({ images, is_noaa, is_meteor }: Pass) => {
  if (!images || !images[0]) {
    return "Unknown";
  }

  if (is_noaa) {
    const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");
    return `${satelliteIdentifier} ${satelitteNumber}`;
  } else if (is_meteor) {
    const [satelliteIdentifier, mNumber, satelitteNumber] = images[0].path.split("-");
    return `${satelliteIdentifier} ${mNumber}-${satelitteNumber}`;
  }

  return "Unknown";
};
