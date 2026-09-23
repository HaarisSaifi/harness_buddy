"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  after,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  after?: string;
  sub?: string;
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div ref={ref} className={`flex max-w-2xl flex-col ${alignCls}`}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-10 bg-gradient-to-r from-cyber to-transparent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.42em] text-cyber">{eyebrow}</span>
        <span className="h-px w-10 bg-gradient-to-l from-cyber to-transparent" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 34 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
        {title} {accent && <span className="holo-text italic">{accent}</span>}
        {after && <span className="text-outline"> {after}</span>}
      </motion.h2>

      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-base leading-relaxed text-mist"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}