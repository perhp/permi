import { Pass } from "@/models/pass.model";
import { graphs } from "./graphs";

export const getImagesWithoutGraphs = (images: Pass["images"]) => {
  return images.filter(({ path }) => !graphs.includes(path));
};
