import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Journey from "../components/sections/Journey";
import Work from "../components/sections/Work";
import AboutSection from "../components/sections/AboutSection";
import Contact from "../components/sections/Contact";
import { prefersReducedMotion } from "../lib/motion";

export default function Landing() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    let cancelled = false;
    const scroll = () => {
      if (cancelled) return;
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    };
    if (document.fonts?.ready) document.fonts.ready.then(scroll);
    else scroll();
    return () => {
      cancelled = true;
    };
  }, [location.hash, location.key]);
  return (
    <main id="main">
      <Hero />
      <Journey />
      <Work />
      <AboutSection />
      <Contact />
    </main>
  );
}
