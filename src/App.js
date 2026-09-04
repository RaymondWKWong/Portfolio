import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import StickyNav from "./components/ui/StickyNav";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import ScrollToTop from "./components/ScrollToTop";
import { MotionConfig } from "framer-motion";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollToTop />
        <StickyNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/project" element={<Navigate to="/#work" replace />} />
          <Route path="/projects" element={<Navigate to="/#work" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </MotionConfig>
  );
}

export default App;
