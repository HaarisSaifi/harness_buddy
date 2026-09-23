"use client";

import { useRef } from "react";
import { useInView, animate } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";
import { STATS } from "@/lib/data";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-bold tabular-nums sm:text-6xl">
        <span className="holo-text">{display.toLocaleString()}</span>
        <span className="text-white">{suffix}</span>
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="glass holo-card grid grid-cols-2 gap-10 rounded-[2rem] px-6 py-14 sm:px-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center gap-3 ${i !== 0 ? "lg:border-l lg:border-white/8" : ""}`}>
              <CountUp value={s.value} suffix={s.suffix} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-mist">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}