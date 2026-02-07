import React from "react";
import Card from "react-bootstrap/Card";
import { VscDebugBreakpointData } from "react-icons/vsc";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi, I'm <span className="purple">Raymond Wong</span> — a PhD
            student at <span className="purple">Imperial College London</span>,
            researching <span className="purple">Machine Learning</span> and
            <span className="purple"> Data Analytics</span> for alloy design in
            metal 3D printing.
            <br />
            <br />
            <strong>Experience</strong>
            <br />
            <VscDebugBreakpointData /> Machine Learning | R&D Specialist @ <span className="purple">01C</span> (Oct 2025 - Present)
            <br />
            <VscDebugBreakpointData /> Quantitative Researcher @ <span className="purple">Daler Trading</span> (May - Oct 2025)
            <br />
            <VscDebugBreakpointData /> Graduate Teaching Assistant @ <span className="purple">Imperial College London</span> (Oct 2022 - Oct 2025)
            <br />
            <br />
            <strong>Education</strong>
            <br />
            <VscDebugBreakpointData /> PhD <span className="purple">Applied Machine Learning</span>, Imperial College London
            <br />
            <VscDebugBreakpointData /> MSc <span className="purple">Engineering Mathematics</span>, University of Bristol
            <br />
            <VscDebugBreakpointData /> BEng <span className="purple">Mechanical Engineering</span>, University of Bristol
          </p>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
