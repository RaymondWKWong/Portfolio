import React from "react";
import Reveal from "../ui/Reveal";
import { publications } from "../../data/publications";
import { conferences } from "../../data/conferences";
import styles from "./PublicationsConferences.module.css";

function PublicationsConferences() {
  return (
    <div className={styles.wrap} id="research">
      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.colLabel}>Publications</p>
          <ul className={styles.pubList}>
            {publications.map((pub, i) => (
              <Reveal as="li" key={i} className={styles.pubItem}>
                <p className={styles.pubAuthors}>{pub.authors}</p>
                <p className={styles.pubTitle}>
                  {pub.doi ? (
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pubLink}
                    >
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </p>
                <p className={styles.pubMeta}>
                  <span>{pub.journal}</span>
                  <span className={styles.pubDot}>·</span>
                  <span>{pub.year}</span>
                  {pub.status === "invited" && (
                    <span className={styles.pubBadge}>Invited Submission</span>
                  )}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <p className={styles.colLabel}>Conferences</p>
          <ul className={styles.confList}>
            {conferences.map((c, i) => (
              <Reveal as="li" key={i} className={styles.confItem}>
                <span className={styles.confYear}>{c.year}</span>
                <span className={styles.confName}>
                  {c.name}
                  {c.location && (
                    <span className={styles.confLocation}>{c.location}</span>
                  )}
                  {c.note && <span className={styles.confNote}>{c.note}</span>}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PublicationsConferences;
