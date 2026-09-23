"use client";

import { motion } from "framer-motion";
import { TRAINERS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";

export default function Trainers() {
  return (
    <section id="coaches" className="relative z-10 py-24 sm:py-32">
      <div className="holo-orb right-[-8%] top-[20%] h-96 w-96 bg-nebula/15" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="The Coaches"
          title="Engineered by"
          accent="champions"
          sub="Olympic lifters, fighters and physios — each Sense of Fitness coach is a specialist weapon in your corner."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="holo-card glass relative overflow-hidden rounded-3xl p-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.grad} opacity-25 transition-opacity duration-500 group-hover:opacity-40`} />
                  <div className="absolute inset-0 grid-lines opacity-50" />

                  {/* silhouette */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4">
                    <div className={`relative flex h-44 w-44 items-center justify-center rounded-t-full bg-gradient-to-t ${t.grad} opacity-80`}>
                      <span className="mb-2 font-display text-6xl font-bold text-void">{t.initials}</span>
                    </div>
                  </div>

                  {/* rotating holo ring on hover */}
                  <div className="absolute left-1/2 top-[30%] animate-orbit hidden h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyber/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block" />
                </div>

                <div className="p-5 text-center">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">{t.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-cyber">{t.role}</p>
                  <p className="mt-1 text-xs text-mist">{t.creds}</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {(["instagram", "xSocial", "youtube"] as const).map((s) => (
                      <span
                        key={s}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 text-mist transition-all duration-300 hover:border-cyber/60 hover:text-cyber"
                      >
                        <Icon name={s} className="h-4 w-4" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}