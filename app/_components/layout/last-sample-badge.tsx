"use client";

import { format } from "date-fns";

type Props = {
  lastSample: string;
};

export default function LastSampleBadge({ lastSample }: Props) {
  return (
    <span>
      LAST SAMPLE {format(new Date(lastSample), "HH:mm")}
      <span className="animate-blink text-accent">_</span>
    </span>
  );
}
