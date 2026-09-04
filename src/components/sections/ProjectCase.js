import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiRotateCcw } from "react-icons/fi";
import styles from "./ProjectCase.module.css";

export default function ProjectCase({ project, isOpen = false, onToggle }) {
  const reduced = useReducedMotion();
  const frontRef = useRef(null);
  const closeRef = useRef(null);
  const backRef = useRef(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus({ preventScroll: true });
      if (backRef.current) backRef.current.scrollTop = 0;
    } else if (wasOpen.current)
      frontRef.current?.focus({ preventScroll: true });
    wasOpen.current = isOpen;
  }, [isOpen]);
  return (
    <article className={styles.case} aria-label={project.title}>
      <div
        className={styles.card}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <motion.div
          className={styles.rotator}
          animate={{ rotateY: reduced ? 0 : isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 26 }}
        >
          <button
            ref={frontRef}
            type="button"
            className={styles.front}
            onClick={onToggle}
            aria-label={`View ${project.title} project details`}
            aria-expanded={isOpen}
            aria-controls={`project-details-${project.serial}`}
            aria-hidden={isOpen}
            inert={isOpen ? "" : undefined}
            tabIndex={isOpen ? -1 : 0}
            style={reduced ? { opacity: isOpen ? 0 : 1 } : undefined}
          >
            <span className={styles.imageWrap}>
              <img
                src={project.image}
                alt={project.imageAlt}
                className={styles.image}
                loading="lazy"
                width="1000"
                height="650"
              />
              <span className={styles.serial}>{project.serial}</span>
              <span className={styles.flipHintFront}>
                Explore <span aria-hidden="true">↗</span>
              </span>
            </span>
            <span className={styles.frontMeta}>
              <span className={styles.year}>{project.year}</span>
              <span className={styles.title}>{project.title}</span>
              <span className={styles.prestige}>{project.prestige}</span>
            </span>
          </button>
          <div
            ref={backRef}
            id={`project-details-${project.serial}`}
            className={styles.back}
            aria-label={`${project.title} details`}
            role="region"
            aria-hidden={!isOpen}
            inert={!isOpen ? "" : undefined}
            style={
              reduced
                ? { transform: "none", opacity: isOpen ? 1 : 0 }
                : undefined
            }
          >
            <div className={styles.backHead}>
              <span className={styles.year}>{project.duration}</span>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={onToggle}
                tabIndex={isOpen ? 0 : -1}
                aria-label={`Close ${project.title} details`}
              >
                <FiRotateCcw aria-hidden="true" />
              </button>
            </div>
            <h3 className={styles.backTitle}>{project.title}</h3>
            <p className={styles.backPrestige}>{project.prestige}</p>
            <dl className={styles.backFacts}>
              <dt>Stack</dt>
              <dd className={styles.stackLine}>
                {project.stack.map((item) => (
                  <span key={item} className={styles.stackChip}>
                    {item}
                  </span>
                ))}
              </dd>
              <dt>Outcome</dt>
              <dd>{project.outcome.replace(/&amp;/g, "&")}</dd>
            </dl>
            <p className={styles.backDetails}>{project.details}</p>
            <div className={styles.backLinks}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.backLink}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {link.label}
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
