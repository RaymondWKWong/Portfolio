import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Journey from "../components/sections/Journey";
import Work from "../components/sections/Work";
import AboutSection from "../components/sections/AboutSection";
import Contact from "../components/sections/Contact";
import { useSectionNav } from "../lib/useSectionNav";

function Landing() {
  const location = useLocation();
  useSectionNav();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const id = hash.slice(1);

    const scrollToId = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(scrollToId, 60);
      });
    } else {
      setTimeout(scrollToId, 200);
    }
  }, [location.hash]);

  return (
    <main>
      <Hero />
      <Journey />
      <Work />
      <AboutSection />
      <Contact />
    </main>
  );
}

export default Landing;
