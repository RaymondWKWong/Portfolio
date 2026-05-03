import React, { lazy, Suspense } from "react";
import { motion, useTransform } from "framer-motion";
import LogoIMC from "../../Assets/Logos/IMC_Logo.jpg";
import LogoOrionHack from "../../Assets/Logos/OrionHack_Logo.jpg";
import LogoMorganStanley from "../../Assets/Logos/MorganStanleyLogo.jpg";
import Logo10DS from "../../Assets/Logos/10DS_Logo.jpg";
import LogoAnthropic from "../../Assets/Logos/Anthropic_Logo.jpg";
import LogoManGroup from "../../Assets/Logos/ManGroup_Logo.jpg";
import LogoQuantMinds from "../../Assets/Logos/QuantMinds_Logo.jpg";

const Earth3DLazy = lazy(() => import("./Earth3D"));

function Earth3D(props) {
  return (
    <Suspense fallback={null}>
      <Earth3DLazy {...props} />
    </Suspense>
  );
}

const STROKE = "var(--ink)";
const STROKE_SOFT = "var(--muted-strong)";
const FILL_SOFT = "var(--paper-2)";
const IMPERIAL_BLUE = "#1d4ed8";
const SIGNAL_BUY = "#16a34a";
const SIGNAL_SELL = "#dc2626";

// ─── helpers ────────────────────────────────────────────────────

function PathLine({ progress, start, end, ...rest }) {
  const len = useTransform(progress, [start, end], [0, 1]);
  return <motion.line {...rest} style={{ pathLength: len }} />;
}

function DrawnPath({ progress, start, end, ...rest }) {
  const len = useTransform(progress, [start, end], [0, 1]);
  return <motion.path {...rest} style={{ pathLength: len }} />;
}

function FadeText({ progress, start, end, children, ...rest }) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <motion.text {...rest} style={{ opacity }}>
      {children}
    </motion.text>
  );
}

// Continuous breathing — scale only. Y-translate removed because sub-pixel
// rounding on big SVG groups was causing edge flicker.
function Breathe({ children, intensity = 1, duration = 18, rotate = false }) {
  return (
    <motion.g
      animate={
        rotate
          ? { rotate: [0, 360], scale: [1, 1.015 * intensity, 1] }
          : { scale: [1, 1.015 * intensity, 0.995, 1] }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: "200px 150px" }}
    >
      {children}
    </motion.g>
  );
}

// ─── Bristol — neural network with loss curve and weight updates ───
function NetNode({ progress, x, y, start, accent = false }) {
  const r = useTransform(progress, [start, start + 0.06], [0, 4.2]);
  const op = useTransform(progress, [start, start + 0.06], [0, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      fill={accent ? IMPERIAL_BLUE : STROKE}
      stroke="var(--paper)"
      strokeWidth="1.2"
      style={{ r, opacity: op }}
    />
  );
}

function NetEdge({ progress, x1, y1, x2, y2, start, weight = 0.5 }) {
  const len = useTransform(progress, [start, start + 0.05], [0, 1]);
  const opTarget = 0.25 + Math.abs(weight) * 0.55;
  const op = useTransform(progress, [start, start + 0.05], [0, opTarget]);
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={weight > 0 ? STROKE : STROKE_SOFT}
      strokeWidth={Math.abs(weight) * 1.4 + 0.35}
      style={{ pathLength: len, opacity: op }}
    />
  );
}

// Firing-neuron loop: each registered edge flashes a small pulse from
// source to target node at staggered intervals. Continuous, autonomous,
// no scroll dependency. Mounted only while scene is active so the loop
// always restarts from delay zero on re-entry.
function FiringPulse({ fromX, fromY, toX, toY, delay, duration, repeatDelay }) {
  return (
    <motion.circle
      r={3.4}
      fill={STROKE_SOFT}
      initial={{ opacity: 0, cx: fromX, cy: fromY }}
      animate={{
        cx: [fromX, toX],
        cy: [fromY, toY],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay,
        times: [0, 0.12, 0.85, 1],
        ease: "easeOut",
      }}
    />
  );
}

function FiringNeurons() {
  // A curated subset of edges across all four layers — enough to read as
  // "the network is alive" without overloading the canvas.
  const FIRINGS = [
    { fromX: 60, fromY: 70, toX: 130, toY: 80, dur: 1.3, delay: 0.0, gap: 2.4 },
    { fromX: 60, fromY: 130, toX: 130, toY: 140, dur: 1.4, delay: 0.4, gap: 2.6 },
    { fromX: 60, fromY: 190, toX: 130, toY: 200, dur: 1.3, delay: 0.9, gap: 2.8 },
    { fromX: 130, fromY: 110, toX: 207, toY: 100, dur: 1.5, delay: 0.3, gap: 2.2 },
    { fromX: 130, fromY: 170, toX: 207, toY: 180, dur: 1.4, delay: 0.7, gap: 2.5 },
    { fromX: 130, fromY: 230, toX: 207, toY: 220, dur: 1.5, delay: 1.1, gap: 2.7 },
    { fromX: 207, fromY: 140, toX: 273, toY: 140, dur: 1.6, delay: 0.5, gap: 2.0 },
    { fromX: 207, fromY: 180, toX: 273, toY: 180, dur: 1.6, delay: 1.2, gap: 2.3 },
  ];
  return (
    <>
      {FIRINGS.map((f, i) => (
        <FiringPulse
          key={`fp-${i}`}
          fromX={f.fromX}
          fromY={f.fromY}
          toX={f.toX}
          toY={f.toY}
          duration={f.dur}
          delay={f.delay}
          repeatDelay={f.gap}
        />
      ))}
    </>
  );
}

export function BristolVisual({ progress, active }) {
  const L1 = [70, 100, 130, 160, 190, 220];
  const L2 = [80, 110, 140, 170, 200, 230];
  const L3 = [100, 140, 180, 220];
  const L4 = [140, 180];

  const w = (i, j, layer) => {
    const seed = (i * 17 + j * 31 + layer * 53) % 100;
    return (seed - 50) / 50;
  };

  return (
    <svg viewBox="0 0 400 300" className="visualSvg" aria-hidden="true">
      <Breathe duration={16} intensity={0.4}>
        {/* eyebrow + bottom equation */}
        <FadeText
          progress={progress}
          start={0}
          end={0.06}
          x="30"
          y="30"
          fontFamily="var(--mono)"
          fontSize="10"
          fill={STROKE_SOFT}
          letterSpacing="0.06em"
        >
          INTERPRETABLE ML
        </FadeText>
        <FadeText
          progress={progress}
          start={0}
          end={0.06}
          x="30"
          y="46"
          fontFamily="var(--mono)"
          fontSize="13"
          fill={STROKE}
          letterSpacing="0"
        >
          x → f(x; θ) → ŷ
        </FadeText>

        {/* layer labels */}
        {[
          { x: 60, label: "x" },
          { x: 130, label: "h₁" },
          { x: 207, label: "h₂" },
          { x: 273, label: "ŷ" },
        ].map((l, i) => (
          <FadeText
            key={l.label}
            progress={progress}
            start={0.04 + i * 0.04}
            end={0.1 + i * 0.04}
            x={l.x}
            y="68"
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="10"
            fill={STROKE_SOFT}
            letterSpacing="0.06em"
          >
            {l.label}
          </FadeText>
        ))}

        {/* nodes */}
        {L1.map((y, i) => (
          <NetNode
            key={`l1-${i}`}
            progress={progress}
            x={60}
            y={y}
            start={0.06 + i * 0.012}
          />
        ))}
        {L2.map((y, i) => (
          <NetNode
            key={`l2-${i}`}
            progress={progress}
            x={130}
            y={y}
            start={0.18 + i * 0.012}
          />
        ))}
        {L3.map((y, i) => (
          <NetNode
            key={`l3-${i}`}
            progress={progress}
            x={207}
            y={y}
            start={0.28 + i * 0.014}
          />
        ))}
        {L4.map((y, i) => (
          <NetNode
            key={`l4-${i}`}
            progress={progress}
            x={273}
            y={y}
            start={0.36 + i * 0.014}
            accent
          />
        ))}

        {/* edges L1 → L2 */}
        {L1.flatMap((y1, i) =>
          L2.map((y2, j) => (
            <NetEdge
              key={`e12-${i}-${j}`}
              progress={progress}
              x1={64}
              y1={y1}
              x2={126}
              y2={y2}
              start={0.42 + (i + j) * 0.004}
              weight={w(i, j, 1)}
            />
          ))
        )}
        {/* edges L2 → L3 */}
        {L2.flatMap((y1, i) =>
          L3.map((y2, j) => (
            <NetEdge
              key={`e23-${i}-${j}`}
              progress={progress}
              x1={134}
              y1={y1}
              x2={203}
              y2={y2}
              start={0.5 + (i + j) * 0.004}
              weight={w(i, j, 2)}
            />
          ))
        )}
        {/* edges L3 → L4 */}
        {L3.flatMap((y1, i) =>
          L4.map((y2, j) => (
            <NetEdge
              key={`e34-${i}-${j}`}
              progress={progress}
              x1={211}
              y1={y1}
              x2={269}
              y2={y2}
              start={0.55 + (i + j) * 0.005}
              weight={w(i, j, 3)}
            />
          ))
        )}

        {/* firing-neuron loop — mount-gated so it restarts on re-entry */}
        {active && <FiringNeurons />}

        {/* loss curve in bottom right */}
        <PathLine
          progress={progress}
          start={0.55}
          end={0.62}
          x1="305"
          y1="265"
          x2="395"
          y2="265"
          stroke={STROKE_SOFT}
          strokeWidth="0.8"
        />
        <PathLine
          progress={progress}
          start={0.55}
          end={0.62}
          x1="305"
          y1="265"
          x2="305"
          y2="200"
          stroke={STROKE_SOFT}
          strokeWidth="0.8"
        />
        <DrawnPath
          progress={progress}
          start={0.6}
          end={0.78}
          d="M 308 205 C 320 215, 340 245, 360 256 S 385 262, 393 263"
          fill="none"
          stroke={IMPERIAL_BLUE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <FadeText
          progress={progress}
          start={0.66}
          end={0.74}
          x="350"
          y="195"
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="9"
          fill={STROKE_SOFT}
          letterSpacing="0.04em"
        >
          training loss ↓
        </FadeText>

        {/* update rule, bottom left, using → so it reads naturally */}
        <FadeText
          progress={progress}
          start={0.7}
          end={0.78}
          x="30"
          y="280"
          fontFamily="var(--mono)"
          fontSize="13"
          fill={STROKE}
          letterSpacing="0"
        >
          θ → θ − α∇L
        </FadeText>
      </Breathe>
    </svg>
  );
}

// ─── Bristol — vibrating beam mode shapes (mech eng + eng maths) ──

// PID controller — step-response curve converges to setpoint with
// proportional / integral / derivative correction labels.
function buildStepResponse() {
  const X0 = 60;
  const W = 280;
  const baseY = 220;
  const SP_Y = 110;
  const samples = 120;
  let d = "";
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const time = t * 12;
    const omega = 1.6;
    const zeta = 0.18;
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    const y =
      1 -
      Math.exp(-zeta * omega * time) *
        (Math.cos(wd * time) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * time));
    const px = X0 + t * W;
    const py = baseY - y * (baseY - SP_Y);
    points.push([px, py]);
    d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
  }
  return { d, points };
}

const STEP_RESPONSE = buildStepResponse();

function StepResponse({ progress, drawStart }) {
  const len = useTransform(progress, [drawStart, drawStart + 0.4], [0, 1]);
  const op = useTransform(progress, [drawStart, drawStart + 0.1], [0, 1]);
  return (
    <motion.path
      d={STEP_RESPONSE.d}
      fill="none"
      stroke={STROKE}
      strokeWidth="1.6"
      strokeLinecap="round"
      style={{ pathLength: len, opacity: op }}
    />
  );
}

// Tracker dot that traces the step response curve on a loop.
// Uses motion-path animation by sampling cx/cy along the precomputed
// trajectory points.
function StepResponseTracker() {
  const xs = STEP_RESPONSE.points.map((p) => p[0]);
  const ys = STEP_RESPONSE.points.map((p) => p[1]);
  return (
    <>
      <motion.circle
        r={5}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.4}
        initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
        animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 0] }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          repeatDelay: 0.6,
          ease: "linear",
          times: [0, 0.05, 0.5, 0.9, 1],
        }}
      />
      <motion.circle
        r={2.4}
        fill={STROKE}
        initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
        animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 0] }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          repeatDelay: 0.6,
          ease: "linear",
          times: [0, 0.05, 0.5, 0.9, 1],
        }}
      />
    </>
  );
}

function GainTerm({ progress, x, y, sub, delay, color = STROKE }) {
  const op = useTransform(progress, [delay, delay + 0.06], [0, 1]);
  const scale = useTransform(progress, [delay, delay + 0.06], [0.85, 1]);
  return (
    <motion.g style={{ opacity: op, scale, transformOrigin: `${x}px ${y}px` }}>
      <rect
        x={x - 22}
        y={y - 11}
        width="44"
        height="22"
        rx="11"
        fill="var(--paper)"
        stroke={color}
        strokeWidth="1.2"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="12"
        fill={color}
        fontWeight="500"
      >
        K
        <tspan fontSize="9" dy="3">
          {sub}
        </tspan>
      </text>
    </motion.g>
  );
}

export function ImperialVisual({ progress, active }) {
  return (
    <svg viewBox="0 0 400 300" className="visualSvg" aria-hidden="true">
      <Breathe duration={16} intensity={0.4}>
        <FadeText
          progress={progress}
          start={0}
          end={0.06}
          x="50"
          y="30"
          fontFamily="var(--mono)"
          fontSize="10"
          fill={STROKE_SOFT}
          letterSpacing="0.06em"
        >
          CONTROL · PID FEEDBACK
        </FadeText>

        {/* axes */}
        <PathLine
          progress={progress}
          start={0.04}
          end={0.12}
          x1="50"
          y1="220"
          x2="370"
          y2="220"
          stroke={STROKE_SOFT}
          strokeWidth="1"
        />
        <PathLine
          progress={progress}
          start={0.04}
          end={0.12}
          x1="50"
          y1="220"
          x2="50"
          y2="60"
          stroke={STROKE_SOFT}
          strokeWidth="1"
        />

        {/* setpoint reference line at y=1 */}
        <PathLine
          progress={progress}
          start={0.1}
          end={0.22}
          x1="60"
          y1="110"
          x2="340"
          y2="110"
          stroke={STROKE_SOFT}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />
        <FadeText
          progress={progress}
          start={0.18}
          end={0.26}
          x="345"
          y="113"
          fontFamily="var(--mono)"
          fontSize="9"
          fill={STROKE_SOFT}
        >
          setpoint
        </FadeText>

        {/* response curve */}
        <StepResponse progress={progress} drawStart={0.22} />

        {/* autonomous tracker — re-traces the curve on a loop */}
        {active && <StepResponseTracker />}

        {/* axis labels */}
        <FadeText
          progress={progress}
          start={0.04}
          end={0.12}
          x="44"
          y="62"
          fontFamily="var(--mono)"
          fontSize="9"
          fill={STROKE_SOFT}
          textAnchor="end"
        >
          y
        </FadeText>
        <FadeText
          progress={progress}
          start={0.04}
          end={0.12}
          x="370"
          y="234"
          fontFamily="var(--mono)"
          fontSize="9"
          fill={STROKE_SOFT}
        >
          t
        </FadeText>

        {/* PID gain pills */}
        <GainTerm progress={progress} x={100} y={258} sub="p" delay={0.7} />
        <GainTerm progress={progress} x={170} y={258} sub="i" delay={0.74} />
        <GainTerm progress={progress} x={240} y={258} sub="d" delay={0.78} />
        <FadeText
          progress={progress}
          start={0.78}
          end={0.86}
          x="290"
          y="263"
          fontFamily="var(--mono)"
          fontSize="12"
          fill={STROKE_SOFT}
        >
          → u(t)
        </FadeText>

        {/* PID equation, bottom — proper math typography with subscripts */}
        <PIDEquation progress={progress} delay={0.86} />
      </Breathe>
    </svg>
  );
}

function PIDEquation({ progress, delay }) {
  const op = useTransform(progress, [delay, delay + 0.08], [0, 1]);
  return (
    <motion.text
      x="50"
      y="295"
      fontFamily="var(--mono)"
      fontSize="13"
      fill={STROKE}
      letterSpacing="0"
      style={{ opacity: op }}
    >
      <tspan fontStyle="italic">u</tspan>
      <tspan>(</tspan>
      <tspan fontStyle="italic">t</tspan>
      <tspan>)  =  K</tspan>
      <tspan fontSize="9" dy="3">
        p
      </tspan>
      <tspan dy="-3">  </tspan>
      <tspan fontStyle="italic">e</tspan>
      <tspan>(</tspan>
      <tspan fontStyle="italic">t</tspan>
      <tspan>)  +  K</tspan>
      <tspan fontSize="9" dy="3">
        i
      </tspan>
      <tspan dy="-3">  ∫ </tspan>
      <tspan fontStyle="italic">e</tspan>
      <tspan>(τ) </tspan>
      <tspan fontStyle="italic">d</tspan>
      <tspan>τ  +  K</tspan>
      <tspan fontSize="9" dy="3">
        d
      </tspan>
      <tspan dy="-3">  </tspan>
      <tspan fontStyle="italic">de</tspan>
      <tspan>/</tspan>
      <tspan fontStyle="italic">dt</tspan>
    </motion.text>
  );
}


// ─── Daler — candlesticks + LSTM forecast ────────────────────────
function Candle({ progress, candle, start }) {
  const op = useTransform(progress, [start, start + 0.08], [0, 1]);
  const sy = useTransform(progress, [start, start + 0.08], [12, 0]);
  return (
    <motion.g style={{ opacity: op, y: sy }}>
      <line
        x1={candle.x}
        y1={candle.top}
        x2={candle.x}
        y2={candle.bottom}
        stroke={STROKE}
        strokeWidth="1"
      />
      <rect
        x={candle.x - 5}
        y={Math.min(candle.openTop, candle.openBottom)}
        width="10"
        height={Math.abs(candle.openBottom - candle.openTop)}
        fill={candle.up ? STROKE : FILL_SOFT}
        stroke={STROKE}
        strokeWidth="1"
      />
    </motion.g>
  );
}

// Continuous loop on Daler: a ripple expands from each signal in sequence,
// reads as "the desk is identifying live trades".
function SignalPing({ cx, cy, color, delay }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      initial={{ r: 6, opacity: 0 }}
      animate={{ r: [6, 22, 22], opacity: [0.85, 0, 0] }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        repeatDelay: 1.8,
        times: [0, 0.55, 1],
        ease: "easeOut",
      }}
    />
  );
}

function DalerPulses() {
  const SIGNALS = [
    { cx: 95, cy: 210, color: SIGNAL_BUY, delay: 0.0 },
    { cx: 170, cy: 125, color: SIGNAL_SELL, delay: 1.0 },
    { cx: 245, cy: 135, color: SIGNAL_BUY, delay: 2.0 },
    { cx: 295, cy: 70, color: SIGNAL_SELL, delay: 3.0 },
  ];
  return (
    <>
      {SIGNALS.map((s, i) => (
        <SignalPing key={i} {...s} />
      ))}
    </>
  );
}

export function DalerVisual({ progress, active }) {
  const candles = [
    { x: 70, top: 180, bottom: 220, openTop: 200, openBottom: 210, up: false },
    { x: 95, top: 140, bottom: 200, openTop: 175, openBottom: 195, up: true },
    { x: 120, top: 160, bottom: 230, openTop: 195, openBottom: 215, up: false },
    { x: 145, top: 100, bottom: 175, openTop: 130, openBottom: 165, up: true },
    { x: 170, top: 110, bottom: 160, openTop: 125, openBottom: 150, up: true },
    { x: 195, top: 130, bottom: 200, openTop: 165, openBottom: 195, up: false },
    { x: 220, top: 90, bottom: 150, openTop: 110, openBottom: 140, up: true },
    { x: 245, top: 70, bottom: 130, openTop: 90, openBottom: 120, up: true },
    { x: 270, top: 100, bottom: 160, openTop: 125, openBottom: 150, up: false },
    { x: 295, top: 60, bottom: 130, openTop: 80, openBottom: 115, up: true },
    { x: 320, top: 50, bottom: 110, openTop: 70, openBottom: 95, up: true },
    { x: 345, top: 70, bottom: 140, openTop: 100, openBottom: 130, up: false },
  ];

  return (
    <svg viewBox="0 0 400 300" className="visualSvg" aria-hidden="true">
      <Breathe duration={15} intensity={0.6}>
        <PathLine
          progress={progress}
          start={0}
          end={0.15}
          x1="50"
          y1="240"
          x2="370"
          y2="240"
          stroke={STROKE_SOFT}
          strokeWidth="1"
        />
        <PathLine
          progress={progress}
          start={0}
          end={0.15}
          x1="50"
          y1="240"
          x2="50"
          y2="40"
          stroke={STROKE_SOFT}
          strokeWidth="1"
        />
        {candles.map((c, i) => (
          <Candle
            key={i}
            progress={progress}
            candle={c}
            start={0.15 + i * 0.025}
          />
        ))}
        <DrawnPath
          progress={progress}
          start={0.55}
          end={0.78}
          d="M 50 215 C 100 190, 150 130, 200 145 S 290 80, 345 75"
          fill="none"
          stroke={STROKE}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Trade signals fire on the chart after the forecast lands */}
        <SignalMark progress={progress} x={95} y={210} type="buy" delay={0.78} />
        <SignalMark progress={progress} x={170} y={125} type="sell" delay={0.81} />
        <SignalMark progress={progress} x={245} y={135} type="buy" delay={0.84} />
        <SignalMark progress={progress} x={295} y={70} type="sell" delay={0.87} />

        {/* PnL pill, top-right corner clear of any signals */}
        <PnLTag progress={progress} x={363} y={28} delay={0.9} value="+18.4%" />

        {/* autonomous signal pulses — mount-gated so they restart on entry */}
        {active && <DalerPulses />}
      </Breathe>
    </svg>
  );
}

function SignalMark({ progress, x, y, type, delay }) {
  const op = useTransform(progress, [delay, delay + 0.06], [0, 1]);
  const scale = useTransform(progress, [delay, delay + 0.06], [0.4, 1]);
  const color = type === "buy" ? SIGNAL_BUY : SIGNAL_SELL;
  const arrow = type === "buy" ? "M -4 4 L 0 -4 L 4 4 Z" : "M -4 -4 L 0 4 L 4 -4 Z";
  const labelY = type === "buy" ? y + 18 : y - 14;
  return (
    <motion.g
      style={{ opacity: op, scale, transformOrigin: `${x}px ${y}px` }}
    >
      <circle cx={x} cy={y} r="7" fill="var(--paper)" stroke={color} strokeWidth="1.4" />
      <path
        d={arrow}
        fill={color}
        transform={`translate(${x} ${y})`}
      />
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="8"
        fill={color}
        letterSpacing="0.04em"
      >
        {type.toUpperCase()}
      </text>
    </motion.g>
  );
}

function PnLTag({ progress, x, y, delay, value }) {
  const op = useTransform(progress, [delay, delay + 0.05], [0, 1]);
  const scale = useTransform(progress, [delay, delay + 0.05], [0.8, 1]);
  const w = 76;
  return (
    <motion.g style={{ opacity: op, scale, transformOrigin: `${x}px ${y}px` }}>
      <rect
        x={x - w / 2}
        y={y - 11}
        width={w}
        height="22"
        rx="11"
        fill={SIGNAL_BUY}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontWeight="500"
        fontSize="11"
        fill="var(--paper)"
        letterSpacing="0"
      >
        PnL {value}
      </text>
    </motion.g>
  );
}

// ─── 01C — 3D world spawning from a single prompt ────────────────
function GridDot({ progress, x, y, start }) {
  const op = useTransform(progress, [start, start + 0.04, 1], [0, 0.4, 0.4]);
  const r = useTransform(progress, [start, start + 0.04], [0, 1]);
  return (
    <motion.circle cx={x} cy={y} fill={STROKE_SOFT} style={{ opacity: op, r }} />
  );
}

function PromptOuterRing({ progress }) {
  const op = useTransform(progress, [0.1, 0.3, 1], [0, 0.2, 0.2]);
  return (
    <motion.circle
      cx="200"
      cy="150"
      r="22"
      fill="none"
      stroke={STROKE}
      strokeWidth="0.6"
      style={{ opacity: op }}
    />
  );
}

function PromptLink({ progress, ox, oy, delay }) {
  const len = useTransform(progress, [delay, delay + 0.05], [0, 1]);
  const op = useTransform(
    progress,
    [delay, delay + 0.05, 0.95, 1],
    [0, 0.4, 0.4, 0.3]
  );
  return (
    <motion.line
      x1="200"
      y1="150"
      x2={ox}
      y2={oy}
      stroke={STROKE_SOFT}
      strokeWidth="0.7"
      style={{ pathLength: len, opacity: op }}
    />
  );
}

function WireCube({ cx, cy, size }) {
  const s = size;
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none" strokeLinejoin="round">
      <polygon
        points={`${cx - s},${cy - s / 2} ${cx},${cy - s} ${cx + s},${cy - s / 2} ${cx},${cy}`}
      />
      <line x1={cx - s} y1={cy - s / 2} x2={cx - s} y2={cy + s / 2} />
      <line x1={cx + s} y1={cy - s / 2} x2={cx + s} y2={cy + s / 2} />
      <line x1={cx} y1={cy} x2={cx} y2={cy + s} />
      <line x1={cx - s} y1={cy + s / 2} x2={cx} y2={cy + s} />
      <line x1={cx} y1={cy + s} x2={cx + s} y2={cy + s / 2} />
    </g>
  );
}

function WirePyramid({ cx, cy, size }) {
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none" strokeLinejoin="round">
      <polygon
        points={`${cx - size},${cy + size * 0.6} ${cx + size},${cy + size * 0.6} ${cx},${cy - size * 0.8}`}
      />
      <line
        x1={cx}
        y1={cy - size * 0.8}
        x2={cx}
        y2={cy + size * 0.6}
        strokeDasharray="2 2"
        strokeWidth="0.6"
      />
    </g>
  );
}

function WireDiamond({ cx, cy, size }) {
  return (
    <polygon
      points={`${cx},${cy - size} ${cx + size * 0.7},${cy} ${cx},${cy + size} ${cx - size * 0.7},${cy}`}
      fill="none"
      stroke={STROKE}
      strokeWidth="0.9"
    />
  );
}

function WireRing({ cx, cy, size }) {
  return (
    <g fill="none">
      <ellipse
        cx={cx}
        cy={cy}
        rx={size}
        ry={size * 0.42}
        stroke={STROKE}
        strokeWidth="0.9"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={size * 0.5}
        ry={size * 0.5}
        stroke={STROKE}
        strokeWidth="0.7"
      />
    </g>
  );
}

function WireOctahedron({ cx, cy, size }) {
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none" strokeLinejoin="round">
      <polygon
        points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
      />
      <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} strokeWidth="0.6" />
      <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} strokeWidth="0.6" />
    </g>
  );
}

function WireHelix({ cx, cy, size }) {
  // 3-loop helix in side projection
  let path = `M ${cx - size} ${cy + size * 0.7}`;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = cx - size + t * size * 2;
    const y = cy + Math.sin(t * Math.PI * 6) * size * 0.4;
    path += ` L ${x} ${y}`;
  }
  return (
    <g stroke={STROKE} strokeWidth="0.9" fill="none">
      <path d={path} />
    </g>
  );
}

function WireCluster({ cx, cy, size }) {
  // small voxel cluster — 3 stacked tiny cubes
  const s = size * 0.55;
  return (
    <g stroke={STROKE} strokeWidth="0.7" fill="none" strokeLinejoin="round">
      <polygon
        points={`${cx - s},${cy - s / 2} ${cx},${cy - s} ${cx + s},${cy - s / 2} ${cx},${cy}`}
      />
      <polygon
        points={`${cx - s * 1.4},${cy} ${cx - s * 0.4},${cy - s * 0.5} ${cx - s * 0.4},${cy + s * 0.5} ${cx - s * 1.4},${cy + s}`}
      />
      <polygon
        points={`${cx + s * 0.4},${cy} ${cx + s * 1.4},${cy - s * 0.5} ${cx + s * 1.4},${cy + s * 0.5} ${cx + s * 0.4},${cy + s}`}
      />
    </g>
  );
}

const WIRE_SHAPES = {
  cube: WireCube,
  pyramid: WirePyramid,
  diamond: WireDiamond,
  ring: WireRing,
  octahedron: WireOctahedron,
  helix: WireHelix,
  cluster: WireCluster,
};

function SpawnedObject({ progress, cx, cy, kind, delay, size, idx, spin }) {
  const op = useTransform(progress, [delay + 0.04, delay + 0.12], [0, 1]);
  const scale = useTransform(
    progress,
    [delay + 0.04, delay + 0.12, 1],
    [0, 1, 1]
  );
  const Shape = WIRE_SHAPES[kind] || WireCube;
  const rotateDir = spin ? 360 : -360;

  return (
    <motion.g
      style={{
        opacity: op,
        scale,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <motion.g
        animate={{
          y: [0, -4, 0, 4, 0],
          rotate: [0, rotateDir],
        }}
        transition={{
          y: {
            duration: 12 + idx * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: -idx * 0.7,
          },
          rotate: {
            duration: 50 + (idx % 5) * 6,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <Shape cx={cx} cy={cy} size={size} />
      </motion.g>
    </motion.g>
  );
}

export function ZeroOneCVisual({ progress }) {
  const promptR = useTransform(progress, [0, 0.06], [0, 6]);
  const promptOp = useTransform(progress, [0, 0.06], [0, 1]);
  const promptRingOp = useTransform(
    progress,
    [0.05, 0.18, 1],
    [0, 0.45, 0.45]
  );
  const promptRingScale = useTransform(
    progress,
    [0.05, 0.5, 1],
    [0.4, 1.6, 1.2]
  );
  const labelOp = useTransform(progress, [0.7, 0.85], [0, 1]);
  const gridOp = useTransform(progress, [0.04, 0.18, 1], [0, 1, 1]);

  // 14 spawn objects in a phyllotaxis-style arrangement
  const kinds = ["cube", "octahedron", "diamond", "ring", "pyramid", "cluster"];
  const objects = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + (i % 2 ? 0 : 0.18);
    const radius = 78 + (i % 3) * 22;
    const cx = 200 + Math.cos(angle) * radius;
    const cy = 150 + Math.sin(angle) * radius * 0.62;
    return {
      idx: i,
      cx,
      cy,
      kind: kinds[i % kinds.length],
      delay: 0.18 + i * 0.025,
      size: 7 + (i % 4) * 2,
      spin: i % 2 === 0,
    };
  });

  // grid dots (background voxel field)
  const dots = [];
  for (let x = 70; x <= 330; x += 30) {
    for (let y = 60; y <= 250; y += 30) {
      dots.push({ x, y });
    }
  }

  return (
    <svg viewBox="0 0 400 300" className="visualSvg" aria-hidden="true">
      {/* faint dot grid backdrop */}
      <motion.g style={{ opacity: gridOp }}>
        {dots.map((d, i) => (
          <GridDot
            key={i}
            progress={progress}
            x={d.x}
            y={d.y}
            start={0.04 + (i % 11) * 0.005}
          />
        ))}
      </motion.g>

      <Breathe duration={18} intensity={0.5}>
        {/* center prompt, ink-black core */}
        <motion.circle
          cx="200"
          cy="150"
          fill={STROKE}
          style={{ r: promptR, opacity: promptOp }}
        />
        <motion.circle
          cx="200"
          cy="150"
          r="14"
          fill="none"
          stroke={STROKE}
          strokeWidth="1"
          style={{
            opacity: promptRingOp,
            scale: promptRingScale,
            transformOrigin: "200px 150px",
          }}
        />
        <PromptOuterRing progress={progress} />

        {/* connections from prompt to each object */}
        {objects.map((o) => (
          <PromptLink
            key={`link-${o.idx}`}
            progress={progress}
            ox={o.cx}
            oy={o.cy}
            delay={o.delay - 0.02}
          />
        ))}

        {/* spawned wireframe objects */}
        {objects.map((o) => (
          <SpawnedObject key={`obj-${o.idx}`} progress={progress} {...o} />
        ))}

        <motion.text
          x="200"
          y="40"
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill={STROKE_SOFT}
          letterSpacing="0.06em"
          style={{ opacity: labelOp }}
        >
          AMARA
        </motion.text>

        <motion.text
          x="200"
          y="285"
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill={STROKE_SOFT}
          letterSpacing="0.06em"
          style={{ opacity: labelOp }}
        >
          PROMPT → 3D WORLD
        </motion.text>
      </Breathe>
    </svg>
  );
}

// ─── Hackathons — 7 brand medals, hover scale, clean inline labels ──
function Medal({ progress, item, index, start, clipId, isActive, onClick }) {
  const settle = start + 0.2;
  const dropY = useTransform(progress, [start, settle], [-180, 0]);
  const op = useTransform(progress, [start, settle], [0, 1]);
  const ringScale = useTransform(progress, [settle, settle + 0.1], [0, 1]);
  const ringOpacity = useTransform(
    progress,
    [settle, settle + 0.1, 1],
    [0, 0.6, 0.6]
  );
  const labelOp = useTransform(
    progress,
    [settle + 0.05, settle + 0.14],
    [0, 1]
  );

  return (
    <motion.g
      style={{ y: dropY, opacity: op, cursor: "pointer" }}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      animate={{ scale: isActive ? 1.12 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      tabIndex={0}
      role="button"
      aria-label={`${item.label} ${item.rank || ""}`}
    >
      <line
        x1={item.x}
        y1={172}
        x2={item.x - 7}
        y2={193}
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <line
        x1={item.x}
        y1={172}
        x2={item.x + 7}
        y2={193}
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <circle
        cx={item.x}
        cy="202"
        r="11"
        fill={FILL_SOFT}
        stroke={STROKE}
        strokeWidth={isActive ? 1.8 : 1.3}
      />
      <defs>
        <clipPath id={clipId}>
          <circle cx={item.x} cy="202" r="9" />
        </clipPath>
      </defs>
      <image
        href={item.logo}
        x={item.x - 9}
        y="193"
        width="18"
        height="18"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <motion.circle
        cx={item.x}
        cy="202"
        r="16"
        fill="none"
        stroke={STROKE_SOFT}
        strokeWidth="0.6"
        style={{
          scale: ringScale,
          opacity: ringOpacity,
          transformOrigin: `${item.x}px 202px`,
        }}
      />
      {item.rank && (
        <motion.text
          x={item.x}
          y="232"
          textAnchor="middle"
          style={{ opacity: labelOp }}
          fontFamily="var(--mono)"
          fontSize="8.5"
          fill={STROKE_SOFT}
        >
          {item.rank}
        </motion.text>
      )}
      <motion.text
        x={item.x}
        y={item.rank ? "245" : "236"}
        textAnchor="middle"
        style={{ opacity: labelOp }}
        fontFamily="var(--mono)"
        fontSize="8.5"
        fill={STROKE}
        fontWeight="500"
      >
        {item.label}
      </motion.text>
    </motion.g>
  );
}

// Continuous loop on Hackathons: a soft ring pulses out from each medal
// in sequence — reads as "the trophies are alive". Pure overlay, doesn't
// touch the click-to-detail Medal component.
function MedalGlowRing({ x, y, delay }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      fill="none"
      stroke={STROKE_SOFT}
      strokeWidth={0.8}
      initial={{ r: 12, opacity: 0 }}
      animate={{ r: [12, 24, 24], opacity: [0, 0.55, 0] }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        repeatDelay: 1.6,
        times: [0, 0.5, 1],
        ease: "easeOut",
      }}
    />
  );
}

function HackathonsPulses({ items }) {
  return (
    <>
      {items.map((it, i) => (
        <MedalGlowRing
          key={`mgr-${i}`}
          x={it.x}
          y={202}
          delay={i * 0.45}
        />
      ))}
    </>
  );
}

export function HackathonsVisual({ progress, active }) {
  const [openIdx, setOpenIdx] = React.useState(null);
  const items = [
    {
      x: 70,
      label: "IMC",
      rank: "107th",
      logo: LogoIMC,
      title: "IMC Prosperity Trading",
      date: "April 2025 · 15 days",
      result: "107th globally · 9th UK · 13,000+ teams",
      blurb: "Live algorithmic trading. Market making, statistical arbitrage, Black-Scholes options pricing, delta hedging.",
      stack: ["Python", "NumPy", "Black-Scholes"],
    },
    {
      x: 120,
      label: "Orion",
      rank: "2nd",
      logo: LogoOrionHack,
      title: "OrionHack",
      date: "2023 · 2 days",
      result: "2nd place / 250+ teams",
      blurb: "LSTM model forecasting collision risk between satellites and orbital debris, with live-data visualisation.",
      stack: ["Python", "PyTorch", "LSTM", "WebGL"],
    },
    {
      x: 170,
      label: "MS C2G",
      rank: "Top 10",
      logo: LogoMorganStanley,
      title: "Morgan Stanley · Code to Give",
      date: "2023 · 5 days",
      result: "Top 10",
      blurb: "MakaStory: accessible story generator for children with impairments. Text, speech, and sign-language input.",
      stack: ["React", "Python", "ML model"],
    },
    {
      x: 220,
      label: "Anthropic",
      logo: LogoAnthropic,
      title: "Anthropic Agents Hackathon",
      date: "2025 · 1 day",
      result: "Selected participant",
      blurb: "Built tool-using agents on Claude with multi-step planning and structured outputs.",
      stack: ["Claude API", "Python", "TypeScript"],
    },
    {
      x: 270,
      label: "ManGroup",
      logo: LogoManGroup,
      title: "Man Group Hackathon",
      date: "2024 · 2 days",
      result: "Selected participant",
      blurb: "Quant strategy hackathon with Man Group's research desk.",
      stack: ["Python", "Time-series"],
    },
    {
      x: 320,
      label: "QuantMinds",
      logo: LogoQuantMinds,
      title: "QuantMinds TradeEntry",
      date: "2024 · 2 days · London",
      result: "Selected participant",
      blurb: "Conference-side trading hackathon, live execution against benchmark strategies.",
      stack: ["Python", "Backtester"],
    },
    {
      x: 370,
      label: "10DS",
      logo: Logo10DS,
      title: "10 Downing Street · Rewire the State",
      date: "2025 · 2 days",
      result: "Selected participant",
      blurb: "Government-tech hackathon: building public-sector tooling with cross-department data.",
      stack: ["Python", "Web", "GovData"],
    },
  ];
  return (
    <svg viewBox="0 0 400 300" className="visualSvg" aria-hidden="true">
      <Breathe duration={14} intensity={0.4}>
        <line
          x1="50"
          y1="222"
          x2="385"
          y2="222"
          stroke={STROKE_SOFT}
          strokeWidth="0.8"
        />
        {items.map((item, i) => (
          <Medal
            key={i}
            progress={progress}
            item={item}
            index={i}
            start={0.06 + i * 0.1}
            clipId={`medal-clip-${i}`}
            isActive={openIdx === i}
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(openIdx === i ? null : i);
            }}
          />
        ))}
        {openIdx !== null && <MedalDetail item={items[openIdx]} />}
      </Breathe>

      {/* autonomous staggered ring pulses, mount-gated on scene entry */}
      {active && <HackathonsPulses items={items} />}
    </svg>
  );
}

function MedalDetail({ item }) {
  return (
    <motion.foreignObject
      x="20"
      y="10"
      width="360"
      height="160"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--rule)",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "var(--sans)",
          color: "var(--ink)",
          boxShadow: "0 12px 24px -16px rgba(20,17,15,0.25)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            color: "var(--muted)",
            letterSpacing: "0.04em",
            lineHeight: 1.3,
          }}
        >
          {item.date}
        </span>
        <strong
          style={{
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {item.title}
        </strong>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.35,
            color: "var(--muted-strong)",
            maxWidth: "100%",
          }}
        >
          {item.blurb}
        </p>
        {item.stack && (
          <div
            style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              marginTop: "auto",
            }}
          >
            {item.stack.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  padding: "2px 7px",
                  border: "1px solid var(--rule-strong)",
                  borderRadius: 999,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.foreignObject>
  );
}

export const ILLUSTRATIONS = {
  BRISTOL: ImperialVisual,
  IMPERIAL: BristolVisual,
  DALER: DalerVisual,
  "01C": Earth3D,
  HACKATHONS: HackathonsVisual,
};
