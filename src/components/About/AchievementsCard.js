import React from "react";
import Card from "react-bootstrap/Card";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { FaMedal } from "react-icons/fa6";

function AchievementsCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <ul>
            <li className="about-activity">
              <VscDebugBreakpointData /> IMC - Prosperity Trading | Ranked 107th Global | 9th UK <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> OrionHack | Awarded 2nd Place <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Morgan Stanley - Code to Give | Ranked Top 10 <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> 10 Downing Street - Rewire the State Hackathon <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Best Research Poster | International Symposium on Advances in Metallurgy <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Teaching Assistant of the Year | Imperial College London <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> First & Second Year Dean's List Awards <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Algorithmic Trading Society | Head of Corporate Relations
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Imperial College Investment Society | Analyst
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AchievementsCard;
