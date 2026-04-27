import React from "react";
import Reveal from "../ui/Reveal";
import styles from "./Bio.module.css";

function Bio() {
  return (
    <div className={styles.wrap} id="bio">
      <div className={styles.bioCol}>
        <Reveal as="p" className={styles.label}>Bio</Reveal>
        <Reveal as="p" className={styles.lead}>
          I'm <em>Raymond Wong</em>, PhD in <em>Applied Machine Learning</em>{" "}
          @ Imperial College London.
        </Reveal>
        <Reveal as="p" className={styles.body}>
          Currently CTO at <strong>01C</strong>, building Amara — generating
          full 3D worlds from a single prompt. Previously a Quantitative
          Researcher at <strong>Daler Trading</strong>, developing
          transformer-based strategies and predictive ML models.
        </Reveal>
        <Reveal as="p" className={styles.body}>
          My research and side projects sit at the intersection of statistical
          learning, materials science, and capital markets. Most of the things
          on this site started as a hackathon, a paper, or a workshop I had
          to teach.
        </Reveal>
      </div>
    </div>
  );
}

export default Bio;
