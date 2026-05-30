/* global React */
const { useState, useEffect, useRef } = React;

/* ─── The recursive improvement loop ─────────────────────────────
   A ring of pipeline stages with a glowing comet that advances
   stage-to-stage. The inner feedback arc + iteration counter make
   the *recursion* legible: probe → analyze → modify → re-probe.     */

const STAGES = [
  { id: "read",    label: "Read INSTRUCTIONS",  note: "Parse the agent's system prompt — its promises become the spec.", tone: "glow" },
  { id: "derive",  label: "Derive 10 probes", note: "Golden-path, constraint, and adversarial probes generated from the spec.", tone: "glow" },
  { id: "run",     label: "Run probes",         note: "Execute behavioral probes against the local, mocked agent.", tone: "cyan" },
  { id: "analyze", label: "Analyze logs",       note: "On failure, inspect traces and isolate the responsible prompt lever.", tone: "warn" },
  { id: "modify",  label: "Modify prompt",      note: "Surgically rewrite instructions, then loop back and re-probe.", tone: "warn" },
  { id: "commit",  label: "Verify & commit",    note: "Refresh the mocked suite, confirm pytest is green, commit to a branch.", tone: "ok" },
];

const CX = 260, CY = 248, R = 150;
const angleOf = (i) => (-90 + i * (360 / STAGES.length)) * (Math.PI / 180);
const nodePos = (i) => ({ x: CX + R * Math.cos(angleOf(i)), y: CY + R * Math.sin(angleOf(i)) });

const TONE = {
  glow: "#8a96ff",
  cyan: "#6fe3ff",
  warn: "#ffb27a",
  ok: "#59e3a7",
};

function LoopDiagram() {
  const [active, setActive] = useState(0);
  const [iter, setIter] = useState(1);
  const [paused, setPaused] = useState(false);
  const tick = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      tick.current += 1;
      setActive((a) => {
        const next = (a + 1) % STAGES.length;
        if (next === 0) setIter((n) => n + 1);
        return next;
      });
    }, 1700);
    return () => clearInterval(id);
  }, [paused]);

  const cometDeg = active * (360 / STAGES.length);
  const cur = STAGES[active];

  return (
    <div
      className="loop"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <svg viewBox="0 0 520 500" width="100%" role="img" aria-label="Recursive agent improvement loop">
        <defs>
          <radialGradient id="cometG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#c9d4ff" />
            <stop offset="100%" stopColor="#8a96ff" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2c3a72" />
            <stop offset="100%" stopColor="#141c3a" />
          </linearGradient>
        </defs>

        {/* base ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#ringG)" strokeWidth="2" strokeDasharray="2 7" />

        {/* progress arc up to active node */}
        <ProgressArc active={active} />

        {/* inner recursion feedback arc: modify(4) -> run(2) */}
        <FeedbackArc active={active} />

        {/* center spiral = "improve" */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "spin 14s linear infinite" }}>
          <path d={spiral(CX, CY, 14, 52, 3.1)} fill="none" stroke="#8a96ff" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
          <path d={spiral(CX, CY, 14, 52, 3.1, true)} fill="none" stroke="#6fe3ff" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
        </g>
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "spin 9s linear infinite reverse" }}>
          <circle cx={CX} cy={CY} r="6" fill="#c9d4ff" filter="url(#soft)" />
        </g>

        {/* nodes */}
        {STAGES.map((s, i) => {
          const p = nodePos(i);
          const on = i === active;
          const col = TONE[s.tone];
          return (
            <g key={s.id} onClick={() => setActive(i)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={on ? 27 : 20} fill="#0d1226" stroke={on ? col : "#1c2748"} strokeWidth={on ? 2.4 : 1.5}
                style={{ transition: "r .5s cubic-bezier(.2,.8,.2,1), stroke .4s" }} />
              {on && <circle cx={p.x} cy={p.y} r="27" fill="none" stroke={col} strokeWidth="2.4" opacity="0.5" filter="url(#soft)" />}
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
                fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="700" fill={on ? "#fff" : "#6b7499"}
                style={{ transition: "fill .4s" }}>{i + 1}</text>
              <text x={p.x} y={p.y + (p.y < CY ? -36 : 40)} textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace" fontSize="11.5" letterSpacing="0.3"
                fill={on ? col : "#aab2d0"} style={{ transition: "fill .4s" }}>{s.label}</text>
            </g>
          );
        })}

        {/* comet riding the ring */}
        <g style={{ transform: `rotate(${cometDeg}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform .9s cubic-bezier(.45,.05,.2,1)" }}>
          <circle cx={CX} cy={CY - R} r="15" fill="url(#cometG)" />
          <circle cx={CX} cy={CY - R} r="4.5" fill="#fff" />
        </g>
      </svg>

      <div className="loop-readout">
        <div className="loop-iter">
          <span className="dot" /> iteration <b>#{iter}</b>
        </div>
        <div className="loop-caption">
          <span className="loop-step" style={{ color: TONE[cur.tone] }}>{String(active + 1).padStart(2, "0")} · {cur.label}</span>
          <p>{cur.note}</p>
        </div>
        <div className="loop-hint">hover to pause · click a node to jump</div>
      </div>
    </div>
  );
}

/* progress arc from node 0 to active */
function ProgressArc({ active }) {
  const seg = 360 / STAGES.length;
  const endA = (-90 + active * seg) * (Math.PI / 180);
  const startA = (-90) * (Math.PI / 180);
  const large = active * seg > 180 ? 1 : 0;
  const sx = CX + R * Math.cos(startA), sy = CY + R * Math.sin(startA);
  const ex = CX + R * Math.cos(endA), ey = CY + R * Math.sin(endA);
  if (active === 0) return null;
  return (
    <path d={`M ${sx} ${sy} A ${R} ${R} 0 ${large} 1 ${ex} ${ey}`} fill="none"
      stroke="#8a96ff" strokeWidth="3" strokeLinecap="round" opacity="0.85"
      style={{ transition: "all .6s" }} filter="url(#soft)" />
  );
}

/* dashed inner chord from modify(4) to run(2) — the recursion */
function FeedbackArc({ active }) {
  const a = nodePos(4), b = nodePos(2);
  const live = active === 4 || active === 3;
  return (
    <g>
      <path d={`M ${a.x} ${a.y} Q ${CX} ${CY} ${b.x} ${b.y}`} fill="none"
        stroke={live ? "#ffb27a" : "#1c2748"} strokeWidth={live ? 2.4 : 1.4}
        strokeDasharray="4 6" opacity={live ? 0.95 : 0.4}
        style={{ transition: "all .4s", animation: live ? "dashflow 1s linear infinite" : "none" }} />
      <text x={(a.x + b.x) / 2 + 6} y={(a.y + b.y) / 2 - 30} textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace" fontSize="10" fill={live ? "#ffb27a" : "#6b7499"}
        style={{ transition: "fill .4s" }}>re-probe ↺</text>
    </g>
  );
}

/* archimedean-ish spiral path */
function spiral(cx, cy, r0, r1, turns, offset = false) {
  const pts = [];
  const steps = 70;
  const start = offset ? Math.PI : 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = start + t * turns * 2 * Math.PI;
    const r = r0 + (r1 - r0) * t;
    pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`);
  }
  return "M " + pts.join(" L ");
}

window.LoopDiagram = LoopDiagram;
