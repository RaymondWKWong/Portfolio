import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "../ui/Reveal";
import ProjectCase from "./ProjectCase";
import { projects } from "../../data/projects";
import styles from "./Work.module.css";

export default function Work() {
  const [selected, setSelected] = useState(null);
  return (
    <section
      className={`${styles.work} section`}
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <h2 id="work-heading">
              Selected <em>work.</em>
            </h2>
          </div>
          <span className={styles.count}>2023 — 2025</span>
        </Reveal>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <Reveal
              as="article"
              className={styles.project}
              key={project.serial}
            >
              <button
                className={styles.card}
                onClick={() => setSelected(project)}
                aria-haspopup="dialog"
                aria-label={`View ${project.title} project details`}
              >
                <span
                  className={`${styles.imageWrap} ${styles[`image${index}`]}`}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                    width="1000"
                    height="650"
                  />
                  <span className={styles.openIcon}>
                    <FiArrowUpRight aria-hidden="true" />
                  </span>
                  <span className={styles.viewLabel}>View project</span>
                </span>
                <span className={styles.meta}>
                  <span className={styles.prestige}>{project.prestige}</span>
                  <span className={styles.year}>{project.year}</span>
                </span>
                <span className={styles.title}>{project.title}</span>
                <span className={styles.summary}>{project.summary}</span>
              </button>
            </Reveal>
          ))}
        </div>
        <ProjectCase project={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
