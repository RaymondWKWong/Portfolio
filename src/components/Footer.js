import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.left}>Raymond Wong · {year}</span>
        <ul className={styles.socials}>
          <li>
            <a
              href="https://github.com/RaymondWKWong"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="GitHub"
            >
              <AiFillGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/raymond-wong-a226a8154"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="LinkedIn"
            >
              <FaLinkedinIn aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/RaymondWongPhD"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="X / Twitter"
            >
              <FaXTwitter aria-hidden="true" />
              <span>X / Twitter</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
