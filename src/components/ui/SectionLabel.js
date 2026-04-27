import React from "react";
import styles from "./SectionLabel.module.css";

function SectionLabel({ serial, label, id }) {
  return (
    <div className={styles.wrap} id={id}>
      <span className={styles.serial}>{serial}</span>
      <span className={styles.dash}>/</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default SectionLabel;
