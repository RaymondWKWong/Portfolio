import React, { useEffect, useRef } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import styles from "./ProjectCase.module.css";

export default function ProjectCase({ project, onClose }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = ref.current.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      {project && (
        <>
          <div className={styles.top}>
            <span>
              {project.year} · {project.duration}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          <div className={styles.content}>
            <span className={styles.prestige}>{project.prestige}</span>
            <h2 id="project-title">{project.title}</h2>
            <p className={styles.summary}>{project.summary}</p>
            <img
              className={styles.image}
              src={project.image}
              alt={project.imageAlt}
              width="1000"
              height="650"
            />
            <dl className={styles.facts}>
              <dt>Stack</dt>
              <dd className={styles.stack}>
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
              <dt>Outcome</dt>
              <dd>{project.outcome.replace(/&amp;/g, "&")}</dd>
            </dl>
            <p className={styles.details}>{project.details}</p>
            <div className={styles.links}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  className="button button-primary"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
