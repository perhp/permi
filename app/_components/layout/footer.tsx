export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d9e4e3] py-7">
      <div className="container flex flex-col gap-2 text-sm text-[#5c6f76] sm:flex-row sm:items-center sm:justify-between">
        <p>Weather images received from orbit in Denmark.</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
          Raspberry Pi · QFH antenna
        </p>
      </div>
    </footer>
  );
}
