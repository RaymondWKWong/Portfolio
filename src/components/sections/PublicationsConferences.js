import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "../ui/Reveal";
import { publications } from "../../data/publications";
import { conferences } from "../../data/conferences";
import styles from "./PublicationsConferences.module.css";

export default function PublicationsConferences() {
  return (
    <div className="container" id="research">
      <Reveal className={styles.heading}>
        <h2 id="research-heading">
          Research<em>.</em>
        </h2>
      </Reveal>
      <div className={styles.grid}>
        <div>
          <p className={styles.label}>Publications</p>
          <ul>
            {publications.map((pub) => (
              <Reveal as="li" key={pub.title} className={styles.publication}>
                <div className={styles.pubMeta}>
                  <span>{pub.journal}</span>
                  <span>{pub.year}</span>
                </div>
                <h3>
                  {pub.doi ? (
                    <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                      <FiArrowUpRight aria-hidden="true" />
                    </a>
                  ) : (
                    pub.title
                  )}
                </h3>
                <p className={styles.authors}>{pub.authors}</p>
                {pub.status === "invited" && (
                  <span className={styles.badge}>Invited Submission</span>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
        <div className={styles.conferences}>
          <p className={styles.label}>Conferences</p>
          <ul>
            {conferences.map((conference) => (
              <Reveal
                as="li"
                key={`${conference.name}-${conference.year}`}
                className={styles.conference}
              >
                <span className={styles.year}>{conference.year}</span>
                <div>
                  <p>{conference.name}</p>
                  {conference.location && (
                    <span className={styles.location}>
                      {conference.location}
                    </span>
                  )}
                  {conference.note && (
                    <span className={styles.note}>{conference.note}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
