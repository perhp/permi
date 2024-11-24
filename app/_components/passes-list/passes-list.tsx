"use client";

import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getSatelliteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

type Props = {
  passes: Pass[];
  refreshOnLoad?: boolean;
};

export default function PassesList({ passes, refreshOnLoad = false }: Props) {
  const router = useRouter();
  const [activePass, setActivePass] = useState<Pass | null>(null);

  const getImage = (images: Pass["images"]) => {
    if (!images || images.length === 0) return null;
    return images.find((image) => image.path.includes("MCIR.jpg") || image.path.includes("221_corrected.jpg")) || images[0];
  };

  const activePassImage = activePass ? getImage(activePass.images) : null;

  useEffect(() => {
    if (!refreshOnLoad) {
      return;
    }

    router.refresh();
  }, []);

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-5">
        {passes.map((pass) => {
          const satelliteName = getSatelliteName(pass);
          const imagesWithoutGraphs = getImagesWithoutGraphs(pass.images);
          const image = getImage(imagesWithoutGraphs);

          return (
            <motion.li key={pass.id}>
              <Link href={`/passes/${pass.id}`} className="flex flex-col group">
                <div className="group flex h-52 md:h-72 lg:h-80 bg-black rounded-xl relative group-hover:shadow-lg transition-shadow">
                  <div className="w-5 h-5 rounded-full border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-white border-b-white/25 animate-spin absolute z-0 inset-0 m-auto" />
                  {image && (
                    <Image
                      src={`${CDN_URL}/images/${image.path}`}
                      alt={image.path.split(".")[0].replace("-", " ")}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-xl relative z-10"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePass(pass);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:border-white/25 transition-opacity absolute text-white bottom-5 inset-x-5 bg-white/15 backdrop-blur-sm border rounded-lg border-white/15 z-10 py-2 flex items-center justify-center gap-2 font-light text-sm"
                  >
                    Quick view
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-2xl font-bold ml-2 text-black mt-2">{satelliteName}</p>
                <p className="text-sm -mt-1 ml-2">{format(new Date(pass.pass_start), "dd. MMM @ HH:mm")}</p>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <AnimatePresence>
        {activePass && (
          <>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActivePass(null)}
              className="fixed flex items-center justify-center w-full h-screen bg-white/20 z-20 top-0 left-0 p-5 backdrop-blur-sm"
            >
              {activePassImage ? (
                <motion.img
                  animate={{ scale: 1 }}
                  initial={{ scale: 0.9 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  src={`${CDN_URL}/images/${activePassImage.path}`}
                  alt={activePassImage.path.split(".")[0].replace("-", " ")}
                  className="rounded-lg mb-3 max-h-full select-none object-contain"
                />
              ) : (
                <p>No image available</p>
              )}
            </motion.div>
            <RemoveScrollBar />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
