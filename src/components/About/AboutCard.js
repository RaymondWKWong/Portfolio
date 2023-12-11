import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { VscDebugBreakpointData } from "react-icons/vsc";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Raymond Wong </span>
            , a PhD student and Graduate Teaching Assistant for <span className="purple">Python</span> and 
            <span className="purple"> Maths</span> at Imperial College London.
            <br />
            <br />
            My PhD research is focused on using <span className="purple">Machine Learning</span> and 
            <span className="purple"> Data Analytics</span> to design new alloys for 3D printing.
            <br />
            I have an MSc in <span className="purple">Engineering Mathematics</span> from University of Bristol 
            and BEng in <span className="purple">Mechanical Engineering</span>, where I completed projects such as:
            <ul>
            <li className="about-activity">
              <VscDebugBreakpointData /> Multi-Group Monte Carlo simulation to estimate parking spaces
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Analysing sources of errors for ocean current predictions to minimise the 
              risks of impacts during oil spills
            </li>
          </ul>
          </p>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
