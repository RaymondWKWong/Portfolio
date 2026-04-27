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

function FluidBackdrop({
  tint = { a: "#3b82f6", b: "#8b5cf6", c: "#ec4899" },
  intensity = 0.55,
}) {
  const background = [
    `radial-gradient(95% 80% at 5% 0%, ${tint.a} 0%, ${withAlpha(
      tint.a,
      0
    )} 60%)`,
    `radial-gradient(95% 85% at 100% 35%, ${tint.b} 0%, ${withAlpha(
      tint.b,
      0
    )} 60%)`,
    `radial-gradient(110% 90% at 45% 110%, ${tint.c} 0%, ${withAlpha(
      tint.c,
      0
    )} 60%)`,
    `linear-gradient(135deg, ${withAlpha(tint.a, 0.18)} 0%, ${withAlpha(
      tint.b,
      0.12
    )} 50%, ${withAlpha(tint.c, 0.18)} 100%)`,
  ].join(", ");

  return (
    <div
      className={styles.fluid}
      aria-hidden="true"
      style={{ "--intensity": intensity, background }}
    />
  );
}

export default FluidBackdrop;
