import { Badge } from "@/components/ui/badge";
import { CDN_URL } from "@/lib/cdn-url";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const graphs = ["spectrogram", "polar-direction", "polar-azel", "histogram"];

type Props = {
  pass: any;
};

export default function Pass({ pass }: Props) {
  const { images, gain, pass_start, is_noaa } = pass;
  const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");

  const satelliteName = is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";
  const imagesWithoutGraphs = images
    .filter((image: any) => !graphs.some((graph) => image.path.includes(graph)))
    .map((image: any) => ({ ...image, is_graph: false }));
  const imagesOfGraphs = images
    .filter((image: any) => graphs.some((graph) => image.path.includes(graph)))
    .map((image: any) => ({ ...image, is_graph: true }));

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-sm font-medium text-gray-500">
          {format(pass_start, "dd. MMM @ HH:mm")} <br />
          <span className="text-4xl font-bold text-black">{satelliteName}</span>
        </h1>
        <Badge variant="outline" className="mt-auto">
          Gain {gain}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-5">
        {[...imagesWithoutGraphs, ...imagesOfGraphs]
          .sort((a, b) => +b.created_at - +a.created_at)
          .map((image) => (
            <div key={image.id} className="flex flex-col">
              <img
                src={`${CDN_URL}/images/${image?.path}`}
                alt={image.path.split(".")[0].replace("-", " ")}
                className={cn("rounded-lg mb-3", image.is_graph && "mix-blend-multiply")}
              />
              <p className="text-lg font-light border-l border-gray-200 pl-5 mt-auto capitalize">
                {image.path
                  .replace(/(.jpg)|(.png)/g, "")
                  .split("-")
                  .slice(4)
                  .join(" ")}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
