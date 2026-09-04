import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "../ui/Reveal";
import CV from "../../Assets/CV.pdf";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      className={`${styles.contact} section`}
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <div className={styles.content}>
            <h2 id="contact-heading">
              Let's <em>talk.</em>
            </h2>
            <div className={styles.copy}>
              <p className={styles.lead}>Research, quant, or 3D worlds.</p>
              <p className={styles.body}>
                Always up for a coffee, a call, or a hackathon. Easiest way to
                reach me is LinkedIn or GitHub. I read everything.
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <a
              href="mailto:raymond.wong@imperial.ac.uk"
              className="button button-primary"
            >
              Email me <FiArrowUpRight aria-hidden="true" />
            </a>
            <a
              href={CV}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Download CV <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
