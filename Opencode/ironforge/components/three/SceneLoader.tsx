"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsDesktop } from "@/lib/useIsMobile";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

const HeroSceneLite = dynamic(() => import("./HeroSceneLite"), {
  ssr: false,
  loading: () => null,
});

export default function SceneLoader({ scrollRef }: { scrollRef: { current: number } }) {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return <div className="absolute inset-0 bg-void" />;

  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        {isDesktop ? <HeroScene scrollRef={scrollRef} /> : <HeroSceneLite scrollRef={scrollRef} />}
      </Suspense>
    </div>
  );
}