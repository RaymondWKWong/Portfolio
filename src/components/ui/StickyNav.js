import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowUpRight, FiX, FiMenu } from "react-icons/fi";
import styles from "./StickyNav.module.css";

const links = [
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "about", label: "Research" },
  { id: "contact", label: "Contact" },
];

export default function StickyNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  const headerRef = useRef(null);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 30);
      let current = "";
      links.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) current = id;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  return (
    <header
      ref={headerRef}
      className={`${styles.nav} ${scrolled || open ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <Link
          to="/#top"
          className={styles.brand}
          aria-label="Raymond Wong, home"
          onClick={() => setOpen(false)}
        >
          Raymond Wong<span>ML · Quant · PhD</span>
        </Link>
        <nav className={styles.desktop} aria-label="Primary">
          {links.map(({ id, label }) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={`${styles.link} ${active === id ? styles.active : ""}`}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <Link to="/resume" className={styles.cv}>
            CV <FiArrowUpRight aria-hidden="true" />
          </Link>
          <button
            ref={toggleRef}
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className={styles.mobile}
          aria-label="Mobile primary"
        >
          {links.map(({ id, label }) => (
            <Link key={id} to={`/#${id}`} onClick={() => setOpen(false)}>
              {label}
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
