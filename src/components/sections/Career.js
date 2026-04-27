import React from "react";
import Reveal from "../ui/Reveal";
import { experience, education } from "../../data/career";
import styles from "./Career.module.css";

function TimelineGroup({ label, items }) {
  return (
    <div className={styles.group}>
      <p className={styles.groupLabel}>{label}</p>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <Reveal as="li" key={`${item.title}-${i}`} className={styles.item}>
            <img
              src={item.logo}
              alt=""
              className={styles.logo}
              loading="lazy"
            />
            <div className={styles.body}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.org}>{item.organization}</p>
              {item.dates && <p className={styles.dates}>{item.dates}</p>}
              {item.note && <p className={styles.note}>{item.note}</p>}
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function Career() {
  return (
    <div className={styles.wrap} id="career">
      <div className={styles.head}>
        <p className={styles.label}>Career</p>
      </div>

      <div className={styles.grid}>
        <TimelineGroup label="Experience" items={experience} />
        <TimelineGroup label="Education" items={education} />
      </div>
    </div>
  );
}

export default Career;
