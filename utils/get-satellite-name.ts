import { Pass } from "@/models/pass.model";

export const getSatelitteName = ({ images, is_noaa }: Pass) => {
  const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");
  return is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";
};
