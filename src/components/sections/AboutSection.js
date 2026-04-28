import React from "react";
// import SectionLabel from "../ui/SectionLabel";
// import Reveal from "../ui/Reveal";
import Bio from "./Bio";
// import Career from "./Career";
import PublicationsConferences from "./PublicationsConferences";
// import SkillsTools from "./SkillsTools";
import styles from "./AboutSection.module.css";

function AboutSection() {
  return (
    <section className={styles.about} id="about">
      {/* <div className={styles.head}>
        <SectionLabel serial="03" label="About" />
      </div> */}

      <Bio />
      {/* <Career /> */}
      <PublicationsConferences />
      {/* <SkillsTools /> */}
    </section>
  );
}

export default AboutSection;
