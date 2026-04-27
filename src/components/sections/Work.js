import React, { useState, useRef, useEffect, useCallback } from "react";
import SectionLabel from "../ui/SectionLabel";
import Hairline from "../ui/Hairline";
import Reveal from "../ui/Reveal";
import ProjectCase from "./ProjectCase";
import { projects } from "../../data/projects";
import styles from "./Work.module.css";

function Work() {
  const [openSerial, setOpenSerial] = useState(null);
  const gridRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    setCanLeft(grid.scrollLeft > 4);
    setCanRight(grid.scrollLeft + grid.clientWidth < grid.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    updateScrollState();
    grid.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      grid.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = (direction) => {
    const grid = gridRef.current;
    if (!grid) return;
    const firstCard = grid.firstElementChild;
    const step = firstCard
      ? firstCard.offsetWidth + 24
      : grid.clientWidth * 0.6;
    grid.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className={`${styles.work} ${styles.workSection}`} id="work">
      <div className={styles.head}>
        <Hairline className={styles.headRule} />
        <Reveal className={styles.headLabel}>
          <SectionLabel serial="02" label="Selected Work" />
        </Reveal>
      </div>

      <div className={styles.gridWrap}>
        <div ref={gridRef} className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCase
              key={p.serial}
              project={p}
              index={i}
              isOpen={openSerial === p.serial}
              onToggle={() =>
                setOpenSerial((curr) => (curr === p.serial ? null : p.serial))
              }
            />
          ))}
        </div>

        <div
          className={`${styles.gridFade} ${styles.gridFadeLeft} ${
            canLeft ? styles.gridFadeShow : ""
          }`}
          aria-hidden="true"
        />
        <div
          className={`${styles.gridFade} ${styles.gridFadeRight} ${
            canRight ? styles.gridFadeShow : ""
          }`}
          aria-hidden="true"
        />

        <button
          type="button"
          className={`${styles.scrollBtn} ${styles.scrollBtnLeft} ${
            canLeft ? styles.scrollBtnShow : ""
          }`}
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll left"
          tabIndex={canLeft ? 0 : -1}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={`${styles.scrollBtn} ${styles.scrollBtnRight} ${
            canRight ? styles.scrollBtnShow : ""
          }`}
          onClick={() => scrollByCard(1)}
          aria-label="Scroll right"
          tabIndex={canRight ? 0 : -1}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

export default Work;
