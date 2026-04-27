import React, { useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { prefersReducedMotion } from "../../lib/motion";
import styles from "./ProjectCase.module.css";

const FACE_EASE = [0.22, 1, 0.36, 1];

function ProjectCase({ project, index = 0, isOpen = false, onToggle }) {
  const ref = useRef(null);
  const open = isOpen;
  const toggle = () => onToggle && onToggle();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reduce = prefersReducedMotion();

  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    [0.96, 1, 1, 0.98]
  );
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.85, 1],
    [0.55, 1, 1, 0.85]
  );

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <motion.article
      ref={ref}
      className={styles.case}
      style={reduce ? undefined : { scale: cardScale, opacity: cardOpacity }}
    >
      <div
        className={`${styles.card} ${open ? styles.cardOpen : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={`${project.title}. ${open ? "Hide" : "Show"} project details.`}
        onClick={() => toggle()}
        onKeyDown={onKey}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="back"
              className={styles.back}
              data-lenis-prevent
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMoveCapture={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: FACE_EASE }}
            >
              <div className={styles.backHead}>
                <span className={styles.backSerial}>{project.serial}</span>
                <span className={styles.backLabel}>
                  CV ENTRY · {project.year}
                </span>
              </div>

              <h3 className={styles.backTitle}>{project.title}</h3>
              <p className={styles.backPrestige}>{project.prestige}</p>

              <dl className={styles.backFacts}>
                {project.duration && (
                  <>
                    <dt>When</dt>
                    <dd>{project.duration}</dd>
                  </>
                )}
                {project.stack && project.stack.length > 0 && (
                  <>
                    <dt>Stack</dt>
                    <dd className={styles.stackLine}>
                      {project.stack.map((t) => (
                        <span key={t} className={styles.stackChip}>
                          {t}
                        </span>
                      ))}
                    </dd>
                  </>
                )}
                {project.outcome && (
                  <>
                    <dt>Outcome</dt>
                    <dd
                      dangerouslySetInnerHTML={{ __html: project.outcome }}
                    />
                  </>
                )}
              </dl>

              {project.details && (
                <p className={styles.backDetails}>{project.details}</p>
              )}

              {project.links?.length > 0 && (
                <div className={styles.backLinks}>
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.backLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{l.label}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              )}

              <span className={styles.flipHint}>
                <span className={styles.flipDot} />
                Tap to close
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              className={styles.front}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: FACE_EASE }}
            >
              <div className={styles.imageWrap}>
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className={styles.image}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <span className={styles.serial}>{project.serial}</span>
                <span className={styles.flipHintFront}>
                  <span className={styles.flipDot} />
                  Tap for details
                </span>
              </div>
              <div className={styles.frontMeta}>
                <span className={styles.year}>{project.year}</span>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.prestige}>{project.prestige}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default ProjectCase;
