"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";
import Icon from "./ui/Icon";
import { scrollToHash } from "@/lib/lenis";

const CtaScene = dynamic(() => import("./three/CtaScene"), { ssr: false, loading: () => null });

export default function CTA() {
  return (
    <section className="relative z-10 overflow-hidden py-32 sm:py-44">
      {/* 3D blob */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 lg:block">
        <CtaScene />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,8,0.1),rgba(5,5,8,0.92)_72%)]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2"
        >
          <Icon name="zap" className="h-4 w-4 text-gold" useCurrentColor />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/75">
            First week · Free trial
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Ready to forge
          <span className="block text-outline">a new body?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
        >
          Seven days of unlimited classes, one holographic body scan and a coach who already knows your
          weaknesses. What are you waiting for?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton onClick={() => scrollToHash("#pricing")}>
            Claim Free Week
            <Icon name="arrowUpRight" className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => scrollToHash("#coaches")}>
            Meet the Coaches
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}