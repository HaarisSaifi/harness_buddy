"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PLANS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";
import MagneticButton from "./ui/MagneticButton";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative z-10 py-24 sm:py-32">
      <div className="holo-orb left-[10%] bottom-[0%] h-96 w-96 bg-plasma/12" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center">
          <SectionHeading
            align="center"
            eyebrow="Membership"
            title="Invest in"
            accent="yourself"
            sub="No lock-in guilt. Pause anytime, join anywhere — your iron is waiting."
          />

          {/* toggle */}
          <div className="mt-10 flex items-center gap-4 rounded-full glass p-1.5">
            {(["Monthly", "Yearly"] as const).map((label) => {
              const active = (label === "Yearly") === yearly;
              return (
                <button
                  key={label}
                  onClick={() => setYearly(label === "Yearly")}
                  className={`relative rounded-full px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                    active ? "text-void" : "text-mist hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="price-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber to-plasma"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
            <span className="hidden pr-3 font-mono text-[10px] uppercase tracking-widest text-gold sm:block">
              {yearly ? "-2 months free" : ""}
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? Math.round(p.price * 0.85) : p.price;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative ${p.featured ? "lg:-mt-6" : ""}`}
              >
                {p.featured && (
                  <div className="absolute -inset-px -z-10 rounded-[2rem] bg-gradient-to-b from-cyber via-nebula to-plasma opacity-80 blur-[2px]" />
                )}
                <div
                  className={`h-full rounded-[2rem] p-8 ${
                    p.featured ? "bg-iron/95 text-white ring-1 ring-white/10" : "glass text-white"
                  }`}
                >
                  {p.featured && (
                    <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyber to-plasma px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-void">
                      <Icon name="crown" className="h-3.5 w-3.5" useCurrentColor /> Most Popular
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{p.name}</h3>
                  <p className="mt-2 text-sm text-mist">{p.tagline}</p>

                  <div className="mt-7 flex items-end gap-1.5">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={price}
                        initial={{ y: 22, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -22, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-6xl font-bold tabular-nums leading-none"
                      >
                        ${price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="pb-1.5 font-mono text-xs uppercase tracking-widest text-mist">
                      / mo{yearly && " · billed yr"}
                    </span>
                  </div>

                  <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  <ul className="space-y-3.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-fog">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyber/30 to-nebula/30">
                          <Icon name="check" className="h-3 w-3 text-cyber" strokeWidth={2.4} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9">
                    <MagneticButton
                      variant={p.featured ? "primary" : "ghost"}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="w-full justify-center"
                    >
                      {p.cta}
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}