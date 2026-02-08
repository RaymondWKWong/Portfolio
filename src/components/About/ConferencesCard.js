import React from "react";
import { VscDebugBreakpointData } from "react-icons/vsc";

function ConferencesCard() {
  return (
    <div className="about-section-box">
      <ul>
        <li className="about-activity">
          <VscDebugBreakpointData /> QuantMinds 2024
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> QuantMinds 2023
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> International Symposium on Advances in Metallurgy
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> TMS 2024
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> AMMS 2023
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> EMMC 2022
        </li>
        <li className="about-activity">
          <VscDebugBreakpointData /> New Frontiers in Materials Design 2022
        </li>
      </ul>
    </div>
  );
}

export default ConferencesCard;
