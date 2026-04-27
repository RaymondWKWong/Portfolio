import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FluidBackdrop from "../ui/FluidBackdrop";
import { journey } from "../../data/journey";
import { ILLUSTRATIONS } from "./JourneyVisuals";
import styles from "./Journey.module.css";

function JourneyScene({ scrollYProgress, start, end, scene, sceneIndex, total }) {
  const fadeIn = 0.03;
  const fadeOut = 0.03;
  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === total - 1;
  const opacityStops = isFirst && isLast
    ? [1, 1, 1, 1]
    : isFirst
    ? [1, 1, 1, 0]
    : isLast
    ? [0, 1, 1, 1]
    : [0, 1, 1, 0];
  const opacity = useTransform(
    scrollYProgress,
    [start, start + fadeIn, end - fadeOut, end],
    opacityStops
  );
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.5 ? "auto" : "none"
  );
  const y = useTransform(scrollYProgress, [start, end], [40, -40]);

  // The illustration draws in across the FIRST 40% of the scene's scroll.
  // The remaining 60% is a soft-lock dwell: scene sits fully revealed while
  // you read, requiring a deliberate scroll to advance to the next chapter.
  const animEnd = start + 0.4 * (end - start);
  const sceneProgress = useTransform(scrollYProgress, [start, animEnd], [0, 1]);

  const wordmarkX = useTransform(scrollYProgress, [start, end], [-30, 30]);
  const wordmarkScale = useTransform(
    scrollYProgress,
    [start, (start + end) / 2, end],
    [0.95, 1.03, 0.97]
  );

  const Visual = ILLUSTRATIONS[scene.visualKey];

  return (
    <motion.div
      className={styles.scene}
      style={{ opacity, y }}
      data-scene={scene.serial}
    >
      <FluidBackdrop tint={scene.tint} intensity={0.42} />

      <motion.div
        className={styles.wordmark}
        style={{ x: wordmarkX, scale: wordmarkScale }}
        aria-hidden="true"
      >
        {scene.wordmark}
      </motion.div>

      <motion.div className={styles.sceneInner} style={{ pointerEvents }}>
        <div className={styles.copy}>
          {scene.logo && (
            <span
              className={styles.brandLogoWrap}
              aria-hidden="true"
            >
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
              <ul className={`${styles.pills} ${scene.pillsLabel ? styles.pillsWithLabel : ""}`}>
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
            {Visual && <Visual progress={sceneProgress} />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Tick({ scrollYProgress, at, label }) {
  const opacity = useTransform(
    scrollYProgress,
    [at - 0.06, at, at + 0.06],
    [0.3, 1, 0.3]
  );
  return (
    <motion.span className={styles.tick} style={{ opacity }}>
      {label}
    </motion.span>
  );
}

function ProgressTrack({ scrollYProgress, total }) {
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className={styles.progress} aria-hidden="true">
      <div className={styles.progressTrack}>
        <motion.div className={styles.progressFill} style={{ height: fill }} />
      </div>
      <div className={styles.progressTicks}>
        {Array.from({ length: total }).map((_, i) => (
          <Tick
            key={i}
            scrollYProgress={scrollYProgress}
            at={total === 1 ? 0.5 : i / (total - 1)}
            label={String(i + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </div>
  );
}

function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const N = journey.length;

  return (
    <section
      ref={ref}
      className={styles.journey}
      id="journey"
      style={{ height: `${N * 240}vh` }}
    >
      <div className={styles.sticky}>
        <div className={styles.stage}>
          {journey.map((s, i) => (
            <JourneyScene
              key={s.serial}
              scrollYProgress={scrollYProgress}
              start={i / N}
              end={(i + 1) / N}
              scene={s}
              sceneIndex={i}
              total={N}
            />
          ))}
        </div>

        <ProgressTrack scrollYProgress={scrollYProgress} total={N} />
      </div>
    </section>
  );
}

export default Journey;
