import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./StickyNav.module.css";

const links = [
  { href: "/#journey", label: "Journey" },
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/resume", label: "CV" },
];

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    if (!isLanding) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  const handleAnchor = (e, href) => {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      setOpen(false);
    }
  };

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${
        open ? styles.open : ""
      }`}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandMark}>Raymond Wong</span>
          <span className={styles.brandMeta}>ML · Quant · PhD</span>
        </Link>

        <nav className={styles.linksDesktop} aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.link}
              onClick={(e) => handleAnchor(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className={styles.linksMobile} aria-label="Primary mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.linkMobile}
              onClick={(e) => handleAnchor(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export default StickyNav;
