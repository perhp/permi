import { Pass } from "@/models/pass.model";

export const getPassImageName = (path: Pass["images"][number]["path"], pass: Pass) => {
  const replaceRegex = /(.jpg)|(.png)|(_)/g;

  if (pass.is_noaa) {
    return path.replace(replaceRegex, " ").split("-").slice(4).join(" ");
  } else if (pass.is_meteor) {
    return path.replace(replaceRegex, " ").split("-").slice(5).join(" ");
  }

  return path.replace(replaceRegex, " ").split("-").join(" ");
};
