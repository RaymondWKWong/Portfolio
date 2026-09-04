import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import portrait from "../../Assets/profile_no_background.webp";
import styles from "./Hero.module.css";

const NAME_EASE = [0.16, 1, 0.3, 1];

const marqueeItems = [
  "Building Amara @ 01C",
  "PhD in Applied Machine Learning @ Imperial",
  "Best Research @ ISAM",
  "Teaching Assistant of the Year @ Imperial",
  "Dean's List × 2 @ Bristol",
  "107th Global @ IMC Prosperity · 20,000+ teams",
  "2nd place @ OrionHack",
  "Top 10 @ Morgan Stanley Code to Give",
  "Rewire the State @ 10 Downing Street",
  "ex-Quant @ Daler Trading",
];

function Hero() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <section className={styles.hero} id="top">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0, ease: NAME_EASE }}
          >
            Raymond Wong
          </motion.span>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: NAME_EASE }}
          >
            Building <em>Amara</em>, generating <em>3D worlds</em> from a single
            prompt.
          </motion.h1>

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: NAME_EASE }}
          >
            CTO @ <em>01C</em> · PhD in Applied ML @ <em>Imperial</em> ·
            ex-quant @ Daler.
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: NAME_EASE }}
          >
            <a href="#journey" className={styles.ctaPrimary}>
              <span>Take a look</span>
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#work" className={styles.ctaSecondary}>
              Selected work
            </a>
            <a href="/resume" className={styles.ctaSecondary}>
              CV
            </a>
          </motion.div>
        </div>

        <motion.div
          className={styles.portraitWrap}
          initial={{
            opacity: 0,
            scale: reduced ? 1 : 0.94,
            y: reduced ? 0 : 16,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.1, ease: NAME_EASE }}
        >
          <div className={styles.portraitOrb}>
            <img
              src={portrait}
              alt="Raymond Wong"
              className={styles.portrait}
              decoding="async"
              loading="eager"
              fetchpriority="high"
              width="1440"
              height="1440"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.marquee}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      >
        <div
          className={styles.marqueeTrack}
          aria-hidden="true"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span>{t}</span>
              <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
        <button
          type="button"
          className={styles.marqueeToggle}
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play highlights" : "Pause highlights"}
          aria-pressed={paused}
        >
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </motion.div>

      <div className={styles.footer}>
        <span>Scroll for the journey</span>
        <span className={styles.footerLine} aria-hidden="true" />
        <span>01 / Journey</span>
      </div>
    </section>
  );
}

export default Hero;
