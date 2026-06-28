import { useEffect } from "react";
import { getLenis, getSnap } from "./lenis";
import { prefersReducedMotion } from "./motion";

// Arrow Up/Down (and Page Up/Down) jump between the page's "stops" — the hero,
// each Journey scene, and the Work / About / Contact sections. The wheel and
// trackpad still scroll freely for fine movement; the keys are the coarse,
// one-press-per-section control.

const DOWN_KEYS = new Set(["ArrowDown", "PageDown"]);
const UP_KEYS = new Set(["ArrowUp", "PageUp"]);
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

// Absolute Y offsets of every stop, ascending. Recomputed per keypress so it
// stays correct across resizes, font loads and layout shifts.
function collectStops() {
  const els = [];
  const top = document.getElementById("top");
  if (top) els.push(top);
  document
    .querySelectorAll("#journey [data-scene]")
    .forEach((el) => els.push(el));
  ["work", "about", "contact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) els.push(el);
  });
  const y = window.scrollY || window.pageYOffset || 0;
  const offsets = els.map((el) => Math.round(el.getBoundingClientRect().top + y));
  return Array.from(new Set(offsets)).sort((a, b) => a - b);
}

export function useSectionNav() {
  useEffect(() => {
    let lock = false;
    let timer = null;

    // Smoothly tween the scroll by stepping Lenis's *immediate* set on a timer.
    // Two deliberate choices: (1) Lenis's own animated scrollTo intermittently
    // no-ops when a native scroll event resets its target mid-flight (repeat
    // presses would stick), and the immediate set is race-free; (2) a timer,
    // not requestAnimationFrame, because background/headless rAF throttling can
    // stall a standalone rAF chain — the timer keeps the jump deterministic.
    const tweenTo = (lenis, to, durationMs, onDone) => {
      if (timer) clearInterval(timer);
      const from = lenis.animatedScroll;
      const dist = to - from;
      const t0 = performance.now();
      timer = setInterval(() => {
        const t = Math.min(1, (performance.now() - t0) / durationMs);
        lenis.scrollTo(from + dist * easeOutCubic(t), {
          immediate: true,
          force: true,
        });
        if (t >= 1) {
          clearInterval(timer);
          timer = null;
          if (onDone) onDone();
        }
      }, 1000 / 60);
    };

    const onKey = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
        return;
      if (e.repeat) return; // ignore key-held auto-repeat
      const isDown = DOWN_KEYS.has(e.key);
      const isUp = UP_KEYS.has(e.key);
      if (!isDown && !isUp) return;

      // Don't hijack arrows while the user is typing / inside a form control.
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          t.isContentEditable
        )
          return;
      }

      const stops = collectStops();
      if (stops.length < 2) return;
      const cur = window.scrollY || window.pageYOffset || 0;
      const EPS = 12; // tolerance so "on a stop" finds the next, not itself
      let dest = null;
      if (isDown) {
        for (const off of stops) {
          if (off > cur + EPS) {
            dest = off;
            break;
          }
        }
      } else {
        for (let i = stops.length - 1; i >= 0; i--) {
          if (stops[i] < cur - EPS) {
            dest = stops[i];
            break;
          }
        }
      }
      // At the very top/bottom: let the browser do its default thing.
      if (dest == null) return;

      e.preventDefault();
      if (lock) return; // one jump per press; live-position keeps taps responsive
      lock = true;
      setTimeout(() => {
        lock = false;
      }, 360);

      const lenis = getLenis();
      if (lenis && typeof lenis.scrollTo === "function") {
        // Pause the Journey proximity-snap so it can't fight the jump.
        const snap = getSnap();
        snap?.stop?.();
        const resume = () => snap?.start?.();
        tweenTo(lenis, dest, 620, resume);
        setTimeout(resume, 1000); // safety net
      } else {
        window.scrollTo({
          top: dest,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    };

    window.addEventListener("keydown", onKey, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) clearInterval(timer);
    };
  }, []);
}
