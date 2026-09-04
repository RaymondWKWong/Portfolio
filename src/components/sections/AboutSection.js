import React from "react";
import PublicationsConferences from "./PublicationsConferences";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section
      className={`${styles.about} section`}
      id="about"
      aria-label="Publications and conferences"
    >
      <PublicationsConferences />
    </section>
  );
}
