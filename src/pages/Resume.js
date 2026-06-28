import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import pdf from "../Assets/CV.pdf";
import styles from "./Resume.module.css";

// The CV is shown with the browser's native PDF viewer via an <iframe>. This is
// deliberately dependency-free: the previous react-pdf + CDN pdf.js worker setup
// rendered a blank 0×0 canvas whenever the worker version/path drifted, so the
// page "opened" but never loaded. A plain embed always renders, and the Download
// link is the guaranteed fallback.
function Resume() {
  return (
    <main className={styles.page}>
      <div className={styles.head}>
        <Link to="/" className={styles.back}>
          <FiArrowLeft aria-hidden="true" /> Back
        </Link>
        <span className={styles.label}>Resume / CV</span>
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.download}
        >
          <AiOutlineDownload aria-hidden="true" />
          Download
        </a>
      </div>

      <div className={styles.frame}>
        {/* <object> renders the browser's native PDF viewer and, on any browser
            that can't display a PDF inline (some mobile/in-app WebViews), shows
            the nested fallback instead of a blank pane. */}
        <object
          data={`${pdf}#view=FitH`}
          type="application/pdf"
          className={styles.doc}
          aria-label="Raymond Wong — CV"
        >
          <div className={styles.objFallback}>
            <p>This browser can’t display the PDF inline.</p>
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.download}
            >
              <AiOutlineDownload aria-hidden="true" />
              Open the CV
            </a>
          </div>
        </object>
      </div>

      <p className={styles.fallback}>
        Trouble viewing it inline?{" "}
        <a href={pdf} target="_blank" rel="noopener noreferrer">
          Open the CV in a new tab <FiExternalLink aria-hidden="true" />
        </a>
      </p>
    </main>
  );
}

export default Resume;
