import {
  DiJavascript1,
  DiReact,
  DiPython,
  DiJava,
} from "react-icons/di";
import React from "react";

// Clean monospace-style R badge to match the line-weight of devicons.
const RBadge = (props) => (
  <svg
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    aria-hidden="true"
    {...props}
  >
    <rect
      x="3"
      y="3"
      width="26"
      height="26"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
      fontWeight="600"
      fontSize="16"
      fill="currentColor"
      letterSpacing="0"
    >
      R
    </text>
  </svg>
);

export const techStack = [
  { Icon: DiPython, label: "Python" },
  { Icon: DiReact, label: "React" },
  { Icon: DiJavascript1, label: "JavaScript" },
  { Icon: DiJava, label: "Java" },
  { Icon: RBadge, label: "R" },
];
