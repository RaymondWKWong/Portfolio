import React from "react";
import Card from "react-bootstrap/Card";
import { VscDebugBreakpointData } from "react-icons/vsc";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            I'm <span className="purple">Raymond Wong</span> — a PhD
            student at <span className="purple">Imperial College London</span>,
            researching <span className="purple">Machine Learning</span> and
            <span className="purple"> Data Analytics</span> for alloy design in
            metal 3D printing.
          </p>
          <p style={{ marginBottom: "5px" }}><strong>Experience</strong></p>
          <ul>
            <li className="about-activity">
              <VscDebugBreakpointData /> Machine Learning | R&D Specialist @ <span className="purple">01C</span> (Oct 2025 - Present)
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Quantitative Researcher @ <span className="purple">Daler Trading</span> (May - Oct 2025)
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Graduate Teaching Assistant @ <span className="purple">Imperial College London</span> (Oct 2022 - Oct 2025)
            </li>
          </ul>
          <p style={{ marginBottom: "5px" }}><strong>Education</strong></p>
          <ul>
            <li className="about-activity">
              <VscDebugBreakpointData /> PhD <span className="purple">Applied Machine Learning</span>, Imperial College London
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> MSc <span className="purple">Engineering Mathematics</span>, University of Bristol
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> BEng <span className="purple">Mechanical Engineering</span>, University of Bristol
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
