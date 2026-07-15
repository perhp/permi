export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rule py-10">
      <div className="container flex flex-col gap-3 font-mono sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] tracking-[-0.01em] text-nav">
          Weather images received from orbit in Denmark.
        </p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-faint">
          Raspberry Pi · QFH antenna · 137 MHz
        </p>
      </div>
    </footer>
  );
}
