import { LockClosedIcon } from "@radix-ui/react-icons";
import { AntennaIcon, PcCase, ServerIcon, UploadIcon } from "lucide-react";
import { Metadata } from "next";
import { Feature, FeatureContent, FeatureTitle } from "./_components/feature";

const features = [
  {
    name: "Homemade QFH antenna.",
    description:
      "The QFH antenna is a type of antenna that is used to receive weather satellite signals. It is circularly polarized and has a low noise floor.",
    icon: UploadIcon,
  },
  {
    name: "Raspberry 4b",
    description: "I have a raspberry pi 4b that runs the software to receive and decode the satellite images.",
    icon: LockClosedIcon,
  },
  {
    name: "Automatic image uploading to supabase storage.",
    description: "All processed images are automatically uploaded to a supabase storage bucket.",
    icon: ServerIcon,
  },
];

export const metadata: Metadata = {
  title: "My setup | permi",
};

export default async function Page() {
  return (
    <main className="container py-16">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
        <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-base font-semibold leading-7 text-gray-600">My satellite image receiving setup</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Raspberry 4b + QFH antenna</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              My setup features a Raspberry Pi 4b paired with a QFH antenna, enabling me to capture weather satellite images from NOAA and
              Meteor-M2 satellites.
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
              <Feature>
                <FeatureTitle>
                  <AntennaIcon className="absolute top-1 left-1 w-5 h-5 mr-2 text-primary" />
                  Homemade QFH antenna.
                </FeatureTitle>
                <FeatureContent>
                  The QFH (Quadrifilar Helix) antenna is a specialized, circularly polarized antenna designed for receiving weather
                  satellite signals. This provides clear and reliable reception of satellite data.
                </FeatureContent>
              </Feature>
              <Feature>
                <FeatureTitle>
                  <PcCase className="absolute top-1 left-1 w-5 h-5 mr-2 text-primary" />
                  Raspberry Pi 4b.
                </FeatureTitle>
                <FeatureContent>
                  The Raspberry Pi 4b is the heart of my setup, running{" "}
                  <a href="https://github.com/jekhokie/raspberry-noaa-v2" target="_blank" className="underline">
                    Raspberry NOAA
                  </a>{" "}
                  software that receives and decodes the satellite images, transforming raw data into visual weather maps.
                </FeatureContent>
              </Feature>
              <Feature>
                <FeatureTitle>
                  <UploadIcon className="absolute top-1 left-1 w-5 h-5 mr-2 text-primary" />
                  Automatic image uploading to Supabase Storage.
                </FeatureTitle>
                <FeatureContent>
                  Once processed, all images are automatically uploaded to a Supabase storage bucket. This automation ensures that the
                  images are securely stored and easily accessible for further sharing.
                </FeatureContent>
              </Feature>
            </dl>
          </div>
        </div>
        <div className="sm:px-6 lg:px-0">
          <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
            <img
              src="/images/setup/qfh.jpeg"
              alt="A QFH antenna installed on a roof"
              width={2432}
              height={1442}
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
