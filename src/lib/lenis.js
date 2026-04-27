import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    const onAnchorClick = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -40, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);
}
