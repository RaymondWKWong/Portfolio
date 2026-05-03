import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import Snap from "lenis/snap";
import FluidBackdrop from "../ui/FluidBackdrop";
import NetworkBackdrop from "../ui/NetworkBackdrop";
import { journey } from "../../data/journey";
import { ILLUSTRATIONS } from "./JourneyVisuals";
import { prefersReducedMotion } from "../../lib/motion";
import { subscribeLenis } from "../../lib/lenis";
import styles from "./Journey.module.css";

function JourneyScene({ scene, sceneRef, active, onActivate }) {
  const inView = useInView(sceneRef, { amount: 0.55 });
  const fullProgress = useMotionValue(1);

  useEffect(() => {
    if (inView) onActivate();
  }, [inView, onActivate]);

  const isActive = active && inView;
  const Visual = ILLUSTRATIONS[scene.visualKey];

  return (
    <div ref={sceneRef} className={styles.scene} data-scene={scene.serial}>
      {scene.network ? (
        <NetworkBackdrop bg={scene.bg} accent={scene.accent} />
      ) : (
        <FluidBackdrop tint={scene.tint} intensity={0.42} bg={scene.bg} />
      )}

      <motion.div
        className={styles.wordmark}
        animate={
          isActive && !prefersReducedMotion()
            ? { scale: [0.97, 1.03, 0.97] }
            : { scale: 1 }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {scene.wordmark}
      </motion.div>

      <div className={styles.sceneInner}>
        <div className={styles.copy}>
          {scene.logo && (
            <span className={styles.brandLogoWrap} aria-hidden="true">
              <img
                src={scene.logo}
                alt=""
                className={styles.brandLogo}
                loading="lazy"
              />
            </span>
          )}
          <span className={styles.brandName}>{scene.chapter}</span>
          <span className={styles.brandSub}>
            {scene.role && (
              <>
                {scene.role}
                <span className={styles.brandDot} aria-hidden="true">
                  ·
                </span>
              </>
            )}
            {scene.period}
          </span>

          <h3 className={styles.headline}>{scene.headline}</h3>

          <div className={styles.bodyWrap}>
            {scene.body.map((p, i) => (
              <p key={i} className={styles.body}>
                {p}
              </p>
            ))}
          </div>

          {scene.news && scene.news.length > 0 && (
            <>
              <p className={styles.pillsLabel}>In the press</p>
              <ul className={styles.newsCards}>
                {scene.news.map((n) => (
                  <li key={n.url} className={styles.newsCardWrap}>
                    <button
                      type="button"
                      className={styles.newsCard}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(n.url, "_blank", "noopener,noreferrer");
                      }}
                      aria-label={`Read: ${n.title} (opens in new tab)`}
                    >
                      <span className={styles.newsThumb}>
                        <img
                          src={n.image}
                          alt=""
                          loading="lazy"
                          className={styles.newsThumbImg}
                        />
                      </span>
                      <span className={styles.newsCardBody}>
                        <span className={styles.newsCardMeta}>
                          {n.source} · {n.date}
                        </span>
                        <span className={styles.newsCardTitle}>{n.title}</span>
                        <span className={styles.newsCardCta}>
                          Read article ↗
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {scene.pills && scene.pills.length > 0 && (
            <>
              {scene.pillsLabel && (
                <p className={styles.pillsLabel}>{scene.pillsLabel}</p>
              )}
              <ul
                className={`${styles.pills} ${
                  scene.pillsLabel ? styles.pillsWithLabel : ""
                }`}
              >
                {scene.pills.map((p) => {
                  const isLink = typeof p === "object" && p.href;
                  const label = typeof p === "string" ? p : p.label;
                  return (
                    <li key={label} className={styles.pillWrap}>
                      {isLink ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.pill} ${styles.pillLink}`}
                        >
                          <span>{label}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span className={styles.pill}>{label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className={styles.visualCol}>
          <div className={styles.visualStage}>
            {Visual && (
              <Visual progress={fullProgress} active={isActive} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTrack({ activeIndex, total, visible }) {
  const fillPct = total <= 1 ? 0 : (activeIndex / (total - 1)) * 100;
  return (
    <div
      className={`${styles.progress} ${visible ? styles.progressVisible : ""}`}
      aria-hidden="true"
    >
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ height: `${fillPct}%` }}
        />
      </div>
      <div className={styles.progressTicks}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={styles.tick}
            style={{ opacity: i === activeIndex ? 1 : 0.3 }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
    </div>
  );
}

function Journey() {
  const sectionRef = useRef(null);
  const sceneRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [journeyInView, setJourneyInView] = useState(false);
  const N = journey.length;

  // Stable refs array
  if (sceneRefs.current.length !== N) {
    sceneRefs.current = Array.from({ length: N }, () => React.createRef());
  }

  // Track whether the journey section is on screen (controls progress fade).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setJourneyInView(entry.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Hook Lenis Snap into journey scenes + neighbouring section anchors,
  // so snapping inside Journey is always to a scene, but scrolling past
  // the last/first scene snaps cleanly into the next/previous section
  // instead of trapping the user.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let snap;
    let removeFns = [];
    const unsubscribe = subscribeLenis((lenis) => {
      removeFns.forEach((fn) => fn?.());
      removeFns = [];
      if (!lenis) {
        snap?.destroy();
        snap = null;
        return;
      }
      snap = new Snap(lenis, {
        type: "proximity",
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        debounce: 120,
        velocityThreshold: 0.4,
      });
      // Hero anchor and Selected Work anchor act as exits.
      const hero = document.getElementById("top");
      const work = document.getElementById("work");
      if (hero) removeFns.push(snap.addElement(hero, { align: ["start"] }));
      sceneRefs.current.forEach((r) => {
        if (r.current)
          removeFns.push(snap.addElement(r.current, { align: ["start"] }));
      });
      if (work) removeFns.push(snap.addElement(work, { align: ["start"] }));
    });
    return () => {
      removeFns.forEach((fn) => fn?.());
      snap?.destroy();
      unsubscribe();
    };
  }, [N]);

  // Active scene tracking via per-scene useInView (set by JourneyScene).
  const sceneCallbacks = useMemo(
    () => journey.map((_, i) => () => setActiveIndex(i)),
    []
  );

  return (
    <section className={styles.journey} id="journey" ref={sectionRef}>
      {journey.map((s, i) => (
        <JourneyScene
          key={s.serial}
          scene={s}
          sceneRef={sceneRefs.current[i]}
          active={activeIndex === i}
          onActivate={sceneCallbacks[i]}
        />
      ))}

      <ProgressTrack
        activeIndex={activeIndex}
        total={N}
        visible={journeyInView}
      />
    </section>
  );
}

export default Journey;
