import React, { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { journey } from "../../data/journey";
import { ILLUSTRATIONS } from "./JourneyVisuals";
import styles from "./Journey.module.css";

function JourneyScene({ scene, onActivate }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const active = useInView(ref, { amount: 0.3 });
  const loaded = useInView(ref, { margin: "300px 0px", once: true });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const progress = useTransform(scrollYProgress, [0.12, 0.86], [0, 1]);
  const full = useMotionValue(1);
  const Visual = ILLUSTRATIONS[scene.visualKey];
  const isSpace = scene.visualKey === "01C";
  useEffect(() => {
    if (active) onActivate(scene.serial);
  }, [active, onActivate, scene.serial]);
  return (
    <section
      ref={ref}
      id={`journey-${scene.serial}`}
      data-scene={scene.serial}
      className={`${styles.scene} ${isSpace ? styles.space : ""}`}
      aria-labelledby={`journey-title-${scene.serial}`}
    >
      <span className={styles.wordmark} aria-hidden="true">
        {scene.wordmark}
      </span>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.chapter}>
            <span>{scene.serial}</span>
            <h2 id={`journey-title-${scene.serial}`}>{scene.chapter}</h2>
          </div>
          <p className={styles.meta}>
            {scene.role}
            <span>·</span>
            {scene.period}
          </p>
          <h3 className={styles.headline}>{scene.headline}</h3>
          <div className={styles.body}>
            {scene.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {scene.pills && (
            <ul className={styles.pills}>
              {scene.pills.map((pill) => (
                <li key={pill}>{pill}</li>
              ))}
            </ul>
          )}
          {scene.news && (
            <div className={styles.press}>
              <p className={styles.pressLabel}>In the press</p>
              <ul>
                {scene.news.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        width="52"
                        height="52"
                      />
                      <span>
                        <span className={styles.pressSource}>
                          {item.source} · {item.date}
                        </span>
                        <span className={styles.pressTitle}>{item.title}</span>
                      </span>
                      <span className={styles.arrow} aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.visual}>
          <div className={styles.visualStage}>
            {loaded && Visual && (
              <Visual progress={reduced ? full : progress} active={active} />
            )}
          </div>
          {isSpace && <span className={styles.gesture}>Drag to rotate</span>}
        </div>
      </div>
    </section>
  );
}

export default function Journey() {
  const ref = useRef(null);
  const visible = useInView(ref, {
    amount: "some",
    margin: "-100px 0px -180px 0px",
  });
  const [active, setActive] = useState("01");
  return (
    <section
      ref={ref}
      id="journey"
      className={styles.journey}
      aria-label="Journey"
    >
      {journey.map((scene) => (
        <JourneyScene key={scene.serial} scene={scene} onActivate={setActive} />
      ))}
      <nav
        className={`${styles.dock} ${visible ? styles.dockVisible : ""}`}
        aria-label="Journey chapters"
        aria-hidden={!visible}
        inert={!visible ? "" : undefined}
      >
        {journey.map((scene) => (
          <a
            key={scene.serial}
            href={`#journey-${scene.serial}`}
            className={active === scene.serial ? styles.current : ""}
            aria-current={active === scene.serial ? "location" : undefined}
          >
            <span className={styles.dockNumber}>{scene.serial}</span>
            <span>{scene.chapter}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
