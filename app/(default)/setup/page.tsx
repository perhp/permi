import { Metadata } from "next";

const specs = [
  { label: "Board", value: "RPi 4B" },
  { label: "Antenna", value: "QFH" },
  { label: "Freq", value: "137 MHz" },
  { label: "Pol.", value: "RHCP" },
];

const chain = [
  { kind: "Source", name: "SKY", highlight: false },
  { kind: "Antenna", name: "QFH", highlight: true },
  { kind: "Front-end", name: "RTL-SDR", highlight: false },
  { kind: "Decode", name: "RPi 4B", highlight: true },
  { kind: "Storage", name: "SUPABASE", highlight: false },
  { kind: "Serve", name: "PERMI.DK", highlight: true },
];

const modules = [
  {
    badge: "Antenna",
    title: "Homemade QFH antenna",
    description:
      "A Quadrifilar Helix — circularly polarized and hand-built for the job. It gives clear, reliable reception of the satellite downlink regardless of pass geometry.",
  },
  {
    badge: "Compute",
    title: "Raspberry Pi 4B",
    description: (
      <>
        The heart of the station, running{" "}
        <a
          href="https://github.com/jekhokie/raspberry-noaa-v2"
          target="_blank"
          rel="noreferrer"
          className="text-accent transition-colors hover:text-accent-hover"
        >
          raspberry-noaa-v2
        </a>{" "}
        to receive and decode passes, turning raw signal into finished weather
        maps.
      </>
    ),
  },
  {
    badge: "Storage",
    title: "Auto-upload to Supabase",
    description:
      "Once processed, every image is pushed automatically to a Supabase storage bucket — securely stored and ready to serve straight to this site.",
  },
];

export const metadata: Metadata = {
  title: "My setup | permi",
};

function SectionHeading({
  label,
  meta,
  title,
}: {
  label: string;
  meta?: string;
  title?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3.5 font-mono">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        [ {label} ]
      </span>
      {title && (
        <h2 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.01em] text-bright">
          {title}
        </h2>
      )}
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
      {meta && (
        <span className="hidden text-[10px] uppercase text-faint sm:block">
          {meta}
        </span>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <main className="pb-8">
      <section className="container flex flex-wrap items-center gap-11 pb-10 pt-11">
        <div className="min-w-[300px] flex-[1_1_440px]">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            {"// the rig"}
          </div>
          <h1 className="mb-2 font-mono text-[clamp(30px,4.6vw,52px)] font-bold leading-[1.05] tracking-[-0.02em] text-[oklch(0.95_0.01_220)]">
            My receiving setup
          </h1>
          <div className="mb-5 font-mono text-[15px] text-accent">
            Raspberry Pi 4B + QFH antenna
          </div>
          <p className="mb-6 max-w-[54ch] text-sm leading-[1.75] text-body-muted [text-wrap:pretty]">
            A Raspberry Pi 4B paired with a homemade QFH antenna, capturing
            weather satellite images from NOAA and Meteor-M2 as they pass
            overhead — recorded, decoded and archived without me lifting a
            finger.
          </p>
          <dl className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-px overflow-hidden rounded-md border border-border bg-border">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-panel px-4 py-3">
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-bright">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="panel min-w-[300px] flex-[0_1_460px] overflow-hidden">
          <div className="relative aspect-[4/3]">
            <img
              src="/images/setup/qfh.jpeg"
              alt="A QFH antenna installed on a roof"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="absolute bottom-2.5 left-2.5 z-[2] rounded-[2px] bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
              QFH · Field deploy
            </span>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <SectionHeading label="Signal path" />
        <div className="flex flex-wrap items-center gap-2.5">
          {chain.map((node, index) => (
            <div key={node.name} className="flex items-center gap-2.5">
              <div
                className={`min-w-[104px] rounded-[5px] border bg-panel px-4 py-3.5 text-center ${
                  node.highlight ? "border-accent/50" : "border-border"
                }`}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {node.kind}
                </div>
                <div
                  className={`mt-1 font-mono text-[13px] font-bold ${
                    node.highlight ? "text-accent" : "text-nav"
                  }`}
                >
                  {node.name}
                </div>
              </div>
              {index < chain.length - 1 && (
                <span
                  aria-hidden="true"
                  className="font-mono text-base text-[oklch(0.5_0.06_200)]"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5 pt-11">
        <SectionHeading
          label="Components"
          meta={`${String(modules.length).padStart(2, "0")} MODULES`}
          title="How it works"
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
          {modules.map((module, index) => (
            <div key={module.title} className="panel px-5.5 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[34px] font-bold leading-none text-[oklch(0.3_0.03_250)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-[2px] border border-accent/40 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                  {module.badge}
                </span>
              </div>
              <h3 className="mb-2.5 font-mono text-base font-bold text-bright">
                {module.title}
              </h3>
              <p className="text-[13px] leading-[1.7] text-body-muted [text-wrap:pretty]">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
