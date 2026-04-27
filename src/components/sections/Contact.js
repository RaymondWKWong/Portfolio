import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import SectionLabel from "../ui/SectionLabel";
import Reveal from "../ui/Reveal";
import CV from "../../Assets/CV.pdf";
import styles from "./Contact.module.css";

function Contact() {
  return (
    <section className={`${styles.contact} section`} id="contact">
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionLabel serial="04" label="Contact" />
          <Reveal as="h2" className={styles.title}>
            <em>Let's talk.</em> Research, quant, or 3D worlds.
          </Reveal>
          <Reveal as="p" className={styles.lede}>
            Always up for a coffee, a call, or a hackathon. Easiest way to
            reach me is LinkedIn or GitHub. I read everything.
          </Reveal>
        </div>

        <Reveal className={styles.actions}>
          <a
            href="mailto:raymond.wong@imperial.ac.uk"
            className={styles.primary}
          >
            <span>Email me</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <a href={CV} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            Download CV
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
