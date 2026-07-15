"use client";

import { useEffect, useState } from "react";

type Props = {
  passEnd: string;
  passStart: string;
};

function formatCountdown(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `T-${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function CountdownBadge({ passEnd, passStart }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const timeout = setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  let label = "T---:--:--";
  if (now !== null) {
    const start = new Date(passStart).getTime();
    const end = new Date(passEnd).getTime();

    if (now >= end) {
      label = "COMPLETE";
    } else if (now >= start) {
      label = "RECEIVING";
    } else {
      label = formatCountdown(start - now);
    }
  }

  return (
    <span className="rounded-[2px] border border-accent/40 px-1.5 py-[3px] font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
      {label}
    </span>
  );
}
