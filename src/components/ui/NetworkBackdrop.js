import React from "react";
import styles from "./NetworkBackdrop.module.css";

// Three clusters arranged across the viewBox with a hub at the middle
// of each. Triangular interconnections inside each cluster + multiple
// bridges + a sub-cluster filling the bottom-left so the composition
// is balanced rather than a left-to-right belt.
const NODES = [
  // Cluster A (upper left)
  { x: 22, y: 28 }, // 0
  { x: 40, y: 22 }, // 1
  { x: 48, y: 38 }, // 2  — hub
  { x: 30, y: 50 }, // 3
  { x: 56, y: 52 }, // 4
  { x: 12, y: 44 }, // 5
  { x: 60, y: 24 }, // 6

  // Cluster B (centre — densest)
  { x: 78, y: 36 }, // 7
  { x: 92, y: 48 }, // 8  — hub
  { x: 100, y: 28 }, // 9
  { x: 82, y: 64 }, // 10
  { x: 108, y: 60 }, // 11
  { x: 76, y: 20 }, // 12
  { x: 112, y: 78 }, // 13

  // Cluster C (right)
  { x: 130, y: 28 }, // 14
  { x: 142, y: 48 }, // 15 — hub
  { x: 156, y: 34 }, // 16
  { x: 158, y: 62 }, // 17
  { x: 130, y: 66 }, // 18
  { x: 172, y: 46 }, // 19
  { x: 180, y: 74 }, // 20
  { x: 162, y: 16 }, // 21

  // Cluster D (bottom-left — fills the empty quadrant)
  { x: 18, y: 70 }, // 22
  { x: 32, y: 78 }, // 23 — sub-hub
  { x: 14, y: 86 }, // 24
  { x: 46, y: 84 }, // 25
  { x: 60, y: 76 }, // 26
  { x: 26, y: 62 }, // 27

  // Top-right satellite
  { x: 188, y: 22 }, // 28

  // Two nodes anchoring beneath the press-pill area
  { x: 28, y: 92 }, // 29
  { x: 52, y: 92 }, // 30
];

const EDGES = [
  // Cluster A internal — triangular fan around hub 2
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 6],
  [2, 3],
  [2, 6],
  [2, 4],
  [3, 4],
  [3, 5],
  [5, 0],

  // Cluster B internal — dense around hub 8
  [7, 8],
  [8, 9],
  [8, 10],
  [8, 11],
  [7, 12],
  [9, 12],
  [10, 13],
  [11, 13],
  [7, 9],
  [10, 11],
  [8, 13],

  // Cluster C internal — around hub 15
  [14, 15],
  [15, 16],
  [15, 17],
  [15, 18],
  [14, 21],
  [16, 19],
  [17, 19],
  [17, 20],
  [19, 20],
  [14, 16],
  [16, 21],
  [18, 20],

  // Cluster D (bottom-left) internal — around hub 23
  [22, 23],
  [22, 24],
  [23, 24],
  [23, 25],
  [23, 27],
  [25, 26],
  [22, 27],
  [24, 25],
  [26, 4],

  // Inter-cluster bridges
  [6, 7],
  [11, 14],
  [13, 18],
  [4, 10],
  [9, 12],
  [3, 27],
  [27, 5],
  [25, 10],
  [13, 17],

  // Satellites
  [21, 28],
  [28, 19],
  [28, 16],

  // Press-pill anchor nodes — tied into the bottom-left cluster
  [29, 24],
  [29, 23],
  [29, 30],
  [30, 25],
  [30, 23],
  // Long bridge across to the right-side cluster, threading under the
  // wordmark "01C".
  [30, 13],
];

const ACTIVE = new Set([2, 8, 15, 23]);

export default function NetworkBackdrop({
  bg = "#0E0E0E",
  accent = "#E7D99F",
}) {
  return (
    <div
      className={styles.wrap}
      aria-hidden="true"
      style={{ backgroundColor: bg }}
    >
      <svg
        className={styles.net}
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Soft glow filter for the active nodes only — used sparingly */}
          <filter id="nb-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className={styles.edges} stroke={accent}>
          {EDGES.map(([a, b], i) => {
            const na = NODES[a];
            const nb = NODES[b];
            return (
              <line
                key={`e-${i}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        <g className={styles.nodes} fill={accent}>
          {NODES.map((n, i) => {
            const active = ACTIVE.has(i);
            return (
              <circle
                key={`n-${i}`}
                cx={n.x}
                cy={n.y}
                r={active ? 0.7 : 0.42}
                fillOpacity={active ? 0.95 : 0.7}
                filter={active ? "url(#nb-glow)" : undefined}
              />
            );
          })}
        </g>
      </svg>
      <div className={styles.grain} />
    </div>
  );
}
