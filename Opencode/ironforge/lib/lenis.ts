import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

export const scrollToHash = (hash: string) => {
  const el = document.querySelector(hash);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
};