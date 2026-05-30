/* global React, ReactDOM, LoopDiagram */
const { useState, useRef } = React;

const REPO = "https://github.com/cloudbloqavi/recursive-agentic-improvements";
const INSTALL = "npx github:cloudbloqavi/recursive-agentic-improvements";

/* ───────────────────── data ───────────────────── */
const SKILLS = [
  {
    cmd: "/create-agent",
    tag: "Research ➔ Plan ➔ Scaffold",
    tone: "#8a96ff",
    blurb: "Scaffolds a new agent from scratch — researching live framework docs before a single file is written.",
    steps: [
      "Query framework MCP / live docs and analyze tool gaps",
      "Generate a blueprint: system-prompt outline + unit-test plan",
      "Wait for explicit developer approval",
      "Scaffold agent files, a pytest suite, and run smoke probes",
    ],
    icon: "create",
  },
  {
    cmd: "/improve-agent",
    tag: "Recursive self-correction",
    tone: "#6fe3ff",
    blurb: "Derives behavioral probes straight from the agent's own instructions, then loops until they pass.",
    steps: [
      "Read INSTRUCTIONS and derive 10 probes",
      "Run all 10 probes: golden-path, edge-case, tool-selection, constraint, and adversarial",
      "On failure: analyze logs, pick a prompt lever, rewrite, re-probe",
      "On pass: refresh mocked suite, verify pytest, commit to a branch",
    ],
    icon: "improve",
  },
  {
    cmd: "/extend-agent",
    tag: "Add capabilities safely",
    tone: "#59e3a7",
    blurb: "Adds new tools or capabilities to an existing agent's configuration — without regressing what already works.",
    steps: [
      "Inspect the current agent + tool registry",
      "Propose a surgical, blueprint-gated change set",
      "Wire new tools and extend the mocked test coverage",
      "Re-run the suite to confirm nothing regressed",
    ],
    icon: "extend",
  },
];

const FRAMEWORKS = [
  {
    key: "agno", name: "Agno", scenario: "Calculator Agent",
    blurb: "Uses a custom add_numbers tool, remembers past calculations, and declines off-topic questions.",
    extra: "agno",
    docs: ["agno/chatbot", "agno/research-assistant"],
  },
  {
    key: "crewai", name: "CrewAI", scenario: "Research & Writing Crew",
    blurb: "Orchestrates a Senior Research Analyst and a Content Writer agent to research any topic and write a concise summary.",
    extra: "crewai",
    docs: ["crewai/content-pipeline", "crewai/research-crew"],
  },
  {
    key: "langgraph", name: "LangGraph", scenario: "ReAct Agent",
    blurb: "Builds a stateful ReAct graph, registers a multiplication tool, and persists state with memory checkpointers.",
    extra: "langgraph",
    docs: ["langgraph/react-agent", "langgraph/multi-agent-supervisor"],
  },
  {
    key: "google_adk", name: "Google ADK", scenario: "Weather Agent",
    blurb: "Demonstrates ADK structural syntax (root_agent export) and binds custom tools like fetch_weather.",
    extra: "google-adk",
    docs: ["google-adk/chatbot", "google-adk/tool-using-agent"],
  },
];

const PRINCIPLES = [
  { t: "Research Before Code", d: "Skills query live documentation via MCP or search APIs to find native tools and imports before generating files." },
  { t: "Blueprint Gatekeeping", d: "Every operation produces a detailed blueprint that needs explicit developer confirmation before any disk write." },
  { t: "Spec is the Source of Truth", d: "Probe suites are derived from the agent's own INSTRUCTIONS — verifying the promises it actually makes." },
  { t: "Determinism by Default", d: "Evaluation uses mocked models, so suites run offline-friendly, fast, and without API keys." },
];

/* ───────────────────── primitives ───────────────────── */
function CopyButton({ text, label = "copy" }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    }).catch(() => {});
  };
  return (
    <button className={"copy" + (done ? " ok" : "")} onClick={copy} aria-label="copy to clipboard">
      {done ? "copied ✓" : label}
    </button>
  );
}

function Command({ text, prompt = "$" }) {
  return (
    <div className="cmd">
      <span className="cmd-prompt">{prompt}</span>
      <code>{text}</code>
      <CopyButton text={text} />
    </div>
  );
}

function SkillGlyph({ kind, color }) {
  // tiny isometric-ish marks echoing the hero art
  if (kind === "improve")
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <g style={{ transformOrigin: "17px 17px", animation: "spin 7s linear infinite" }}>
          <path d="M17 5 A12 12 0 1 1 6.5 11" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M17 5 l-4 -3 M17 5 l-4 4" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </svg>
    );
  if (kind === "extend")
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <circle cx="8" cy="17" r="3.2" fill={color} />
        <circle cx="24" cy="8" r="3.2" stroke={color} strokeWidth="2.2" />
        <circle cx="24" cy="26" r="3.2" stroke={color} strokeWidth="2.2" />
        <circle cx="27" cy="17" r="2.6" stroke={color} strokeWidth="2.2" />
        <path d="M11 16 L21 9 M11 18 L21 25 M11 17 L24.5 17" stroke={color} strokeWidth="2" />
      </svg>
    );
  // create
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 3 L30 10.5 L17 18 L4 10.5 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M4 10.5 V23 L17 30.5 V18" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 10.5 V23 L17 30.5" stroke={color} strokeWidth="2.2" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function SkillCard({ s, open, onToggle }) {
  return (
    <div className={"skill" + (open ? " open" : "")} onClick={onToggle} style={{ "--accent": s.tone }}>
      <div className="skill-top">
        <div className="skill-glyph"><SkillGlyph kind={s.icon} color={s.tone} /></div>
        <div className="skill-id">
          <code className="skill-cmd">{s.cmd}</code>
          <span className="skill-tag">{s.tag}</span>
        </div>
        <span className="skill-chev" aria-hidden>{open ? "−" : "+"}</span>
      </div>
      <p className="skill-blurb">{s.blurb}</p>
      <div className="skill-steps" style={{ maxHeight: open ? 280 : 0 }}>
        <ol>
          {s.steps.map((st, i) => <li key={i}><span className="num">{i + 1}</span>{st}</li>)}
        </ol>
      </div>
    </div>
  );
}

function Frameworks() {
  const [act, setAct] = useState(0);
  const f = FRAMEWORKS[act];
  return (
    <div className="fw">
      <div className="fw-tabs" role="tablist">
        {FRAMEWORKS.map((x, i) => (
          <button key={x.key} role="tab" aria-selected={i === act}
            className={"fw-tab" + (i === act ? " on" : "")} onClick={() => setAct(i)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="fw-panel" key={f.key}>
        <div className="fw-info">
          <div className="fw-scenario">{f.scenario}</div>
          <p className="fw-blurb">{f.blurb}</p>
          <div className="fw-docs">
            {f.docs.map((d) => (
              <a key={d} className="doc-pill" href={`${REPO}/tree/main/docs/${d}`} target="_blank" rel="noopener">
                docs/{d}
              </a>
            ))}
          </div>
        </div>
        <div className="fw-run">
          <div className="fw-run-label">install &amp; run</div>
          <Command text={`uv sync --extra ${f.extra}`} />
          <Command text={`uv run pytest tests/${f.key}/`} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── page ───────────────────── */
function App() {
  const [openSkill, setOpenSkill] = useState(1); // improve open by default

  return (
    <>
      <AppStyles />

      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top">
            <span className="brand-prompt">&gt;_</span>
            <span className="brand-name">recursive-agentic-improvements</span>
          </a>
          <nav className="nav-links">
            <a href="#skills">Skills</a>
            <a href="#frameworks">Frameworks</a>
            <a href="#principles">Principles</a>
            <a className="nav-gh" href={REPO} target="_blank" rel="noopener">★ GitHub</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="kbd">&gt;_</span> Claude Code skills · MIT</div>
            <h1>
              Agents that <span className="grad">improve themselves</span>.
            </h1>
            <p className="lede">
              Three slash commands that research, scaffold, test, and
              <em> recursively optimize</em> AI agents — across Agno, CrewAI,
              LangGraph, and Google ADK.
            </p>

            <div className="install">
              <Command text={INSTALL} prompt="$" />
              <div className="install-sub">Drops <code>.claude/commands/</code> + a testing constitution into your project.</div>
            </div>

            <div className="cta">
              <a className="btn primary" href={REPO} target="_blank" rel="noopener">View on GitHub →</a>
              <a className="btn ghost" href={`${REPO}/blob/main/QUICKSTART.md`} target="_blank" rel="noopener">5-min Quickstart</a>
            </div>

            <div className="stat-row">
              <div className="stat"><b>3</b><span>slash commands</span></div>
              <div className="stat"><b>4</b><span>frameworks</span></div>
              <div className="stat"><b>0</b><span>API keys to test</span></div>
            </div>
          </div>

          <div className="hero-loop">
            <LoopDiagram />
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="sec wrap">
          <SecHead n="01" title="The three skills" sub="Self-contained slash commands you install once, then drive from chat." />
          <div className="skills">
            {SKILLS.map((s, i) => (
              <SkillCard key={s.cmd} s={s} open={openSkill === i} onToggle={() => setOpenSkill(openSkill === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* FRAMEWORKS */}
        <section id="frameworks" className="sec wrap">
          <SecHead n="02" title="Four frameworks, one workflow" sub="Each ships a runnable, mock-based showcase under tests/ — offline and key-free." />
          <Frameworks />
        </section>

        {/* PRINCIPLES */}
        <section id="principles" className="sec wrap">
          <SecHead n="03" title="Design principles" sub="The guardrails every skill operates under." />
          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <div className="principle" key={i}>
                <span className="p-idx">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="sec wrap">
          <div className="endcap">
            <div>
              <h2>Install it into your agent project</h2>
              <p>One command. Then run <span className="kbd">/create-agent</span> to scaffold, <span className="kbd">/improve-agent</span> to optimize.</p>
            </div>
            <div className="endcap-cmd">
              <Command text={INSTALL} prompt="$" />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <span className="brand-prompt">&gt;_</span>
        <span>recursive-agentic-improvements</span>
        <span className="dot-sep">·</span>
        <a href={REPO} target="_blank" rel="noopener">GitHub</a>
        <span className="dot-sep">·</span>
        <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener">MIT License</a>
        <span className="foot-end">built for agent engineers</span>
      </footer>
    </>
  );
}

function SecHead({ n, title, sub }) {
  return (
    <div className="sec-head">
      <span className="sec-n">{n}</span>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
