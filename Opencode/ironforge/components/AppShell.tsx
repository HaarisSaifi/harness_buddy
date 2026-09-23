"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>{!loaded && <Preloader onDone={() => setLoaded(true)} />}</AnimatePresence>
      {loaded && <SmoothScroll>{children}</SmoothScroll>}
    </>
  );
}