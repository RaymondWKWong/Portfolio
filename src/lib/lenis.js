import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

let _lenis = null;
const subscribers = new Set();

export function getLenis() {
  return _lenis;
}

export function subscribeLenis(cb) {
  subscribers.add(cb);
  if (_lenis) cb(_lenis);
  return () => subscribers.delete(cb);
}

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      // Mouse-wheel notches send big single-impulse deltas with no momentum,
      // so each click should traverse more pixels — otherwise Lenis settles
      // before the snap engine can register sustained velocity, and proximity
      // snap drags the user back. Trackpads send small streaming deltas and
      // are unaffected.
      wheelMultiplier: 1.5,
    });
    _lenis = lenis;
    subscribers.forEach((cb) => cb(lenis));

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
      _lenis = null;
      subscribers.forEach((cb) => cb(null));
      lenis.destroy();
    };
  }, []);
}
