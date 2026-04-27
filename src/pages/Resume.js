import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { AiOutlineDownload } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import pdf from "../Assets/CV.pdf";
import styles from "./Resume.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Resume() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
        <Document file={pdf} className={styles.doc}>
          <Page
            pageNumber={1}
            scale={width > 900 ? 1.5 : 0.55}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    </main>
  );
}

export default Resume;
