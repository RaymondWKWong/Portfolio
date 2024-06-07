import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { CiMedal } from "react-icons/ci";
import { FaMedal } from "react-icons/fa6";
import { VscDebugBreakpointDataUnverified } from "react-icons/vsc";

function AchievementsCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <ul>
            <li className="about-activity">
              <VscDebugBreakpointData /> IMC - Prosperity Trading | Ranked Top 5% Global | 48th UK <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> OrionHack | Awarded 2nd Place <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Morgan Stanley - Code to Give | Ranked Top 10 <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> First & Second Year Dean's List Awards <FaMedal />
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Algorithmic Trading Society | Head of Corporate Relations
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Imperial College Investment Society | Junior Analyst
            </li>
            <li className="about-activity">
              <VscDebugBreakpointData /> Conferences:
              <br />
              &nbsp; &nbsp; &nbsp;
              <VscDebugBreakpointDataUnverified /> QuantMinds 2023
              <br />
              &nbsp; &nbsp; &nbsp;
              <VscDebugBreakpointDataUnverified /> TMS 2024
              <br />
              &nbsp; &nbsp; &nbsp;
              <VscDebugBreakpointDataUnverified /> AMMS 2023
              <br />
              &nbsp; &nbsp; &nbsp;
              <VscDebugBreakpointDataUnverified /> EMMC 2022
              <br />
              &nbsp; &nbsp; &nbsp;
              <VscDebugBreakpointDataUnverified /> New Frontiers in Materials Design 2022
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AchievementsCard;
