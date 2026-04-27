export const prefersReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

export const staggerParent = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const hairlineDraw = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export const reduceVariants = (variants) => {
  if (!prefersReducedMotion()) return variants;
  const flat = {};
  for (const key of Object.keys(variants)) {
    flat[key] = { opacity: 1, y: 0, scaleX: 1, x: 0, scale: 1 };
  }
  return flat;
};

export const viewport = { once: true, margin: "0px 0px -10% 0px" };
