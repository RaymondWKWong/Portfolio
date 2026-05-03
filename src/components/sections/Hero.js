import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import portrait from "../../Assets/profile_no_background.png";
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

function PageCurtain() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className={styles.curtain}
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.4, ease: NAME_EASE }}
        >
          <div className={styles.curtainInner}>
            <span className={styles.curtainMark}>RW</span>
            <span className={styles.curtainMeta}>RAYMOND · WONG · 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  return (
    <section className={styles.hero} id="top">
      <PageCurtain />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: NAME_EASE }}
          >
            Raymond Wong
          </motion.span>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.6, ease: NAME_EASE }}
          >
            Building <em>Amara</em>, generating <em>3D worlds</em> from a
            single prompt.
          </motion.h1>

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.0, ease: NAME_EASE }}
          >
            CTO @ <em>01C</em> · PhD in Applied ML @ <em>Imperial</em> ·
            ex-quant @ Daler.
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.3, ease: NAME_EASE }}
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
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.6, ease: NAME_EASE }}
        >
          <div className={styles.portraitOrb}>
            <img
              src={portrait}
              alt="Raymond Wong"
              className={styles.portrait}
              decoding="async"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.marquee}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.5 }}
        aria-hidden="true"
      >
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span>{t}</span>
              <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
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
