import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { journey } from "../../data/journey";
import Reveal from "../ui/Reveal";
import styles from "./Journey.module.css";

function Chapter({ scene }) {
  return (
    <div className={styles.chapter}>
      <div className={styles.story}>
        <div className={styles.meta}>
          {scene.logo && (
            <img
              src={scene.logo}
              alt=""
              width="36"
              height="36"
              loading="lazy"
            />
          )}
          <span>
            {scene.role}
            <br />
            <span className={styles.org}>{scene.org}</span>
          </span>
        </div>
        <h3>{scene.headline}</h3>
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
        <p className={styles.period}>{scene.period}</p>
      </div>
      {scene.news ? (
        <div className={styles.press}>
          <div className={styles.amara} aria-hidden="true">
            <span>Amara</span>
            <i>by 01C</i>
          </div>
          <ul>
            {scene.news.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.pressSource}>
                    {item.source} <FiArrowUpRight aria-hidden="true" />
                  </span>
                  <span className={styles.pressTitle}>{item.title}</span>
                  <span className={styles.pressDate}>{item.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.chapterVisual}>
          {scene.visualKey === "IMPERIAL" && (
            <>
              <span className={styles.visualSmall}>
                Imperial College London
              </span>
              <span className={styles.visualType}>
                Applied
                <br />
                <em>
                  Machine
                  <br />
                  Learning.
                </em>
              </span>
              <span className={styles.visualSmall}>Materials science × ML</span>
            </>
          )}
          {scene.visualKey === "DALER" && (
            <>
              <span className={styles.visualSmall}>
                Transformer-based strategies
              </span>
              <span className={styles.metric}>1.8</span>
              <span className={styles.metricLabel}>Sharpe ratio</span>
              <span className={styles.visualSmall}>Daler Trading</span>
            </>
          )}
          {scene.visualKey === "BRISTOL" && (
            <>
              <span className={styles.visualSmall}>University of Bristol</span>
              <span className={styles.visualType}>
                Maths.
                <br />
                Computing.
                <br />
                <em>Systems.</em>
              </span>
              <span className={styles.visualSmall}>BEng → MSc</span>
            </>
          )}
          {scene.visualKey === "HACKATHONS" && (
            <>
              <span className={styles.visualSmall}>IMC Prosperity</span>
              <span className={styles.metric}>
                107<span>th</span>
              </span>
              <span className={styles.metricLabel}>
                Globally · 20,000+ teams
              </span>
              <div className={styles.logoGrid}>
                {scene.visualGrid.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={
                      [
                        "IMC",
                        "OrionHack",
                        "Morgan Stanley",
                        "Anthropic",
                        "10 Downing Street",
                      ][index]
                    }
                    width="44"
                    height="44"
                    loading="lazy"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Journey() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const reduce = useReducedMotion();
  const onKey = (event, index) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % journey.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + journey.length) % journey.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = journey.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };
  return (
    <section
      className={`${styles.journey} section`}
      id="journey"
      aria-labelledby="journey-heading"
    >
      <div className="container">
        <Reveal className={styles.heading}>
          <h2 id="journey-heading">
            The <em>journey.</em>
          </h2>
        </Reveal>
        <div className={styles.layout}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Journey chapters"
          >
            {journey.map((scene, index) => (
              <button
                key={scene.serial}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                id={`chapter-tab-${scene.serial}`}
                role="tab"
                aria-selected={active === index}
                aria-controls={`chapter-panel-${scene.serial}`}
                tabIndex={active === index ? 0 : -1}
                onKeyDown={(event) => onKey(event, index)}
                onClick={() => setActive(index)}
                className={`${styles.tab} ${active === index ? styles.selected : ""}`}
              >
                <span className={styles.tabNumber}>{scene.serial}</span>
                <span>{scene.chapter}</span>
                <FiArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={styles.panels}>
            {journey.map((scene, index) => (
              <div
                key={scene.serial}
                id={`chapter-panel-${scene.serial}`}
                role="tabpanel"
                aria-labelledby={`chapter-tab-${scene.serial}`}
                hidden={active !== index}
                tabIndex={0}
              >
                {active === index && (
                  <motion.div
                    initial={{ opacity: 0.5, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Chapter scene={scene} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
