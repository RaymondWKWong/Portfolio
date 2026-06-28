import React from "react";
import styles from "./FluidBackdrop.module.css";

function withAlpha(hex, alpha) {
  if (!hex || hex[0] !== "#") return hex;
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Apple-wallpaper light stage: an even, full-bleed near-white gradient with
// only a *whisper* of the scene's brand colour, applied evenly (no lopsided
// corner stains). Color identity is carried by the data-viz + a single accent,
// not the page — so scenes stay tonally unified, calm, and minimal as you scroll.
function FluidBackdrop({
  tint = { a: "#3b82f6", b: "#8b5cf6", c: "#ec4899" },
  intensity = 0.4,
  bg,
}) {
  const base = bg || "#fcfcfe";
  const k = Math.max(0.18, Math.min(0.5, intensity));
  // a single, soft, centered bloom of the brand hue — even and balanced
  const bloom = withAlpha(tint.b, 0.05 * k + 0.015);
  const bloomEdge = withAlpha(tint.a, 0.03 * k + 0.008);

  const layers = [
    // gentle even brand wash, centered high — wallpaper-soft, never a stain
    `radial-gradient(120% 100% at 50% -10%, ${bloom} 0%, ${bloomEdge} 40%, transparent 78%)`,
    // smooth vertical depth: brighter top, a touch cooler at the floor
    `linear-gradient(180deg, #ffffff 0%, ${base} 46%, #f4f4f8 100%)`,
  ];

  return (
    <div className={styles.fluid} aria-hidden="true">
      <div className={styles.wash} style={{ background: layers.join(", ") }} />
      <div className={styles.grain} />
    </div>
  );
}

export default FluidBackdrop;
