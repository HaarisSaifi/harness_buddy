"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import SceneLoader from "./three/SceneLoader";
import MagneticButton from "./ui/MagneticButton";
import Icon from "./ui/Icon";
import { scrollToHash } from "@/lib/lenis";

const eased = [0.22, 1, 0.36, 1] as const;

function RevealLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: eased }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function StatChip({
  icon,
  value,
  label,
  className = "",
  delay = 0,
}: {
  icon: "users" | "crown" | "star";
  value: string;
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: eased }}
      className={`absolute z-20 hidden lg:block ${className}`}
    >
      <div className="animate-float glass flex items-center gap-3 rounded-2xl px-4 py-3 holo-card">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyber to-nebula">
          <Icon name={icon} className="h-5 w-5 text-void" useCurrentColor />
        </span>
        <span>
          <span className="block font-display text-lg font-bold text-white">{value}</span>
          <span className="block font-mono text-[10px] uppercase tracking-widest text-mist">{label}</span>
        </span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const chipY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* 3D scene */}
      <SceneLoader scrollRef={scrollRef} />

      {/* overlays */}
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,8,0.72)_82%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/70 via-transparent to-void" />
      <div className="holo-orb animate-pulse-glow left-[8%] top-[18%] h-80 w-80 bg-cyber/25" />
      <div className="holo-orb animate-pulse-glow right-[6%] bottom-[22%] h-96 w-96 bg-plasma/20" style={{ animationDelay: "1.4s" }} />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-28 pt-32 sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: eased }}
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full glass px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/80">
            Premium · Founded 2011 · 24/7 Open
          </span>
        </motion.div>

        <h1 className="max-w-4xl font-display font-bold uppercase leading-[0.98] tracking-tight">
          <RevealLine delay={1.15} className="text-outline text-[16vw] sm:text-[11vw] lg:text-[7.4rem]">
            Forge
          </RevealLine>
          <RevealLine delay={1.25} className="text-outline text-[16vw] sm:text-[11vw] lg:text-[7.4rem]">
            Your
          </RevealLine>
          <RevealLine delay={1.35} className="holo-text text-[16vw] sm:text-[11vw] lg:text-[7.4rem]">
            Iron Legacy
          </RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.7, ease: eased }}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
        >
          Step into an arena where chrome meets holograms. Elite coaches, recovery labs and
          real-time 3D biomechanics — engineered to rebuild you, rep by rep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7, ease: eased }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <MagneticButton onClick={() => scrollToHash("#pricing")}>
            Start Training
            <Icon name="play" className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton as="a" href="#programs" variant="ghost" onClick={() => scrollToHash("#programs")}>
            Explore Programs
            <Icon name="chevronDown" className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Floating stat chips */}
      <motion.div style={{ y: chipY }} className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <StatChip icon="users" value="12K+" label="Members" className="left-[6%] top-[30%]" delay={2.0} />
        <StatChip icon="crown" value="40+" label="Elite Coaches" className="right-[7%] top-[40%]" delay={2.15} />
        <StatChip icon="star" value="4.9/5" label="Member Rating" className="bottom-[24%] left-[14%]" delay={2.3} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-mist">Scroll</span>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-gradient-to-b from-cyber to-plasma"
          />
        </div>
      </motion.div>
    </section>
  );
}