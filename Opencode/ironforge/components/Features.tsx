"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FEATURES } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";

function TiltCard({
  icon,
  title,
  desc,
  glow,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  glow: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 160, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
      className="group"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="holo-card glass relative h-full rounded-3xl p-7 transition-shadow duration-500 group-hover:shadow-[0_24px_70px_-28px_var(--glow)]"
      >
        <div style={{ ["--glow" as string]: glow }} className="absolute inset-0 rounded-3xl" />
        <div style={{ transform: "translateZ(46px)" }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber/20 to-nebula/20 ring-1 ring-white/10 transition-all duration-500 group-hover:from-cyber group-hover:to-nebula">
            <Icon name={icon as never} className="h-7 w-7 text-cyber transition-colors duration-500 group-hover:text-void" />
          </span>
          <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-tight text-white">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist">{desc}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyber opacity-0 transition-all duration-500 group-hover:opacity-100">
            <span className="h-px w-6 bg-cyber" /> Integrate
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="about" className="relative z-10 py-24 sm:py-32">
      <div className="holo-orb left-[-10%] top-[10%] h-96 w-96 bg-cyber/15" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The Experience"
            title="Built like a"
            accent="hypercar"
            sub="Every detail inside Sense of Fitness is tuned for maximum output — from the biomechanics of the floor to the holograms on the mirrors."
          />
          <a
            href="#programs"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#programs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group mb-1 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mist transition-colors hover:text-cyber lg:flex"
          >
            View all 6 pillars
            <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}