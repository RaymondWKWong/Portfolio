import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import portrait from "../../Assets/profile_no_background.webp";
import styles from "./Hero.module.css";

const transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

export default function Hero() {
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 100, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 100, damping: 25 });
  const enter = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { ...transition, delay: reduce ? 0 : delay },
  });
  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const bounds = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - bounds.left - bounds.width / 2) * 0.025);
    pointerY.set((e.clientY - bounds.top - bounds.height / 2) * 0.025);
  };
  return (
    <section
      className={styles.hero}
      id="top"
      onPointerMove={onMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.p className={styles.intro} {...enter()}>
            <span className={styles.status} /> ML · Quant · PhD
          </motion.p>
          <motion.h1 className={styles.name} {...enter(0.07)}>
            Raymond
            <br />
            <span>Wong.</span>
          </motion.h1>
          <motion.p className={styles.headline} {...enter(0.16)}>
            Building <em>Amara</em>, generating <em>3D worlds</em> from a single
            prompt.
          </motion.p>
          <motion.p className={styles.sub} {...enter(0.23)}>
            CTO @ 01C · PhD in Applied ML @ Imperial · ex-quant @ Daler.
          </motion.p>
          <motion.div className={styles.actions} {...enter(0.3)}>
            <a href="#journey" className="button button-primary">
              Take a look <FiArrowDown aria-hidden="true" />
            </a>
            <a href="#work" className="text-link">
              Selected work <FiArrowUpRight aria-hidden="true" />
            </a>
          </motion.div>
        </div>
        <motion.div className={styles.portraitStage} {...enter(0.18)}>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.orbitOuter} aria-hidden="true" />
          <motion.div
            className={styles.portraitFrame}
            style={reduce ? undefined : { x, y }}
          >
            <img
              className={styles.portrait}
              src={portrait}
              alt="Raymond Wong"
              width="1827"
              height="1827"
              fetchpriority="high"
            />
          </motion.div>
          <div className={styles.caption}>
            <span className={styles.captionLine} />
            <span>ML · Quant · PhD</span>
          </div>
        </motion.div>
      </div>
      <div className={styles.bottom}>
        <span>Scroll for the journey</span>
        <a href="#journey">
          <FiArrowDown aria-hidden="true" />
          <span className="sr-only">Explore the journey</span>
        </a>
        <span>Research, quant, or 3D worlds.</span>
      </div>
    </section>
  );
}
