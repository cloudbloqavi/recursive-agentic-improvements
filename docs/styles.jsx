/* global React */
/* All layout CSS for the landing page, injected once. */
function AppStyles() {
  return <style>{`
/* ── nav ── */
.nav { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(14px);
  background: linear-gradient(180deg, rgba(4,5,10,0.92), rgba(4,5,10,0.55));
  border-bottom: 1px solid var(--line-soft); }
.nav-in { display: flex; align-items: center; justify-content: space-between; height: 62px; }
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.brand-prompt { font-family: var(--mono); font-weight: 700; color: var(--glow-bright);
  text-shadow: 0 0 14px rgba(138,150,255,0.6); }
.brand-name { font-family: var(--mono); font-size: 13.5px; color: var(--ink-dim); letter-spacing: -.2px; }
.nav-links { display: flex; align-items: center; gap: 26px; }
.nav-links a { color: var(--ink-dim); text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; }
.nav-links a:hover { color: var(--ink); }
.nav-gh { font-family: var(--mono); font-size: 13px !important; border: 1px solid var(--line);
  padding: 6px 13px; border-radius: 8px; color: var(--glow-bright) !important; background: var(--panel-2); }
.nav-gh:hover { border-color: var(--glow); box-shadow: 0 0 18px rgba(138,150,255,0.25); }

/* ── hero ── */
.hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center;
  padding: 78px 28px 64px; min-height: calc(100vh - 62px); }
.hero-copy { }
.eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono);
  font-size: 12.5px; color: var(--ink-mute); letter-spacing: .4px; margin-bottom: 22px; }
.hero h1 { font-family: var(--display); font-weight: 700; font-size: clamp(40px, 5.4vw, 68px);
  line-height: 1.02; letter-spacing: -1.6px; margin: 0 0 20px; }
.grad { background: linear-gradient(100deg, var(--glow-bright), var(--glow) 45%, var(--cyan));
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.lede { font-size: clamp(16px, 1.5vw, 19px); line-height: 1.6; color: var(--ink-dim);
  max-width: 540px; margin: 0 0 28px; }
.lede em { color: var(--glow-bright); font-style: normal; }

.install { margin-bottom: 22px; }
.install-sub { font-size: 12.5px; color: var(--ink-mute); margin-top: 9px; padding-left: 2px; }
.install-sub code { font-family: var(--mono); color: var(--ink-dim); }

/* command line */
.cmd { display: flex; align-items: center; gap: 11px; background: var(--bg-2);
  border: 1px solid var(--line); border-radius: 11px; padding: 12px 12px 12px 15px;
  font-family: var(--mono); }
.cmd + .cmd { margin-top: 9px; }
.cmd-prompt { color: var(--glow); font-weight: 700; user-select: none; }
.cmd code { color: var(--ink); font-size: 13.5px; flex: 1; overflow-x: auto; white-space: nowrap; }
.cmd code::-webkit-scrollbar { height: 0; }
.copy { font-family: var(--mono); font-size: 11.5px; color: var(--ink-dim); cursor: pointer;
  background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 5px 10px;
  transition: all .18s; flex-shrink: 0; }
.copy:hover { color: var(--ink); border-color: var(--glow); }
.copy.ok { color: var(--ok); border-color: var(--ok); }

.cta { display: flex; gap: 13px; flex-wrap: wrap; margin-bottom: 36px; }
.btn { font-family: var(--display); font-weight: 600; font-size: 15px; text-decoration: none;
  padding: 12px 22px; border-radius: 11px; transition: all .2s; display: inline-flex; align-items: center; }
.btn.primary { color: #06070d; background: linear-gradient(180deg, var(--glow-bright), var(--glow));
  box-shadow: 0 8px 30px rgba(138,150,255,0.35); }
.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 38px rgba(138,150,255,0.5); }
.btn.ghost { color: var(--ink); border: 1px solid var(--line); background: var(--panel-2); }
.btn.ghost:hover { border-color: var(--glow); color: #fff; }

.stat-row { display: flex; gap: 34px; }
.stat { display: flex; flex-direction: column; }
.stat b { font-family: var(--display); font-size: 30px; color: #fff; line-height: 1; }
.stat span { font-family: var(--mono); font-size: 11.5px; color: var(--ink-mute); margin-top: 6px; }

.hero-loop { }

/* loop diagram */
.loop { position: relative; }
.loop svg { display: block; filter: drop-shadow(0 0 40px rgba(47,61,122,0.4)); }
.loop-readout { margin-top: -6px; }
.loop-iter { display: inline-flex; align-items: center; gap: 8px; font-family: var(--mono);
  font-size: 12px; color: var(--ink-dim); margin-bottom: 8px; }
.loop-iter b { color: var(--glow-bright); }
.loop-iter .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--glow);
  box-shadow: 0 0 10px var(--glow); animation: pulseGlow 1.4s ease-in-out infinite; }
.loop-caption { min-height: 70px; }
.loop-step { font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: .3px; }
.loop-caption p { margin: 6px 0 0; font-size: 13.5px; color: var(--ink-dim); line-height: 1.5; max-width: 440px; }
.loop-hint { font-family: var(--mono); font-size: 11px; color: var(--ink-mute); margin-top: 10px; }

/* ── sections ── */
.sec { padding: 56px 28px; }
.sec-head { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 34px; }
.sec-n { font-family: var(--mono); font-size: 13px; color: var(--glow); border: 1px solid var(--line);
  border-radius: 8px; padding: 5px 9px; margin-top: 4px; flex-shrink: 0;
  box-shadow: inset 0 0 16px rgba(138,150,255,0.08); }
.sec-head h2 { font-family: var(--display); font-weight: 700; font-size: clamp(26px,3vw,36px);
  letter-spacing: -.8px; margin: 0 0 6px; }
.sec-head p { margin: 0; color: var(--ink-dim); font-size: 15.5px; max-width: 620px; }

/* skills */
.skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.skill { background: linear-gradient(180deg, var(--panel), var(--bg-1)); border: 1px solid var(--line-soft);
  border-radius: var(--r); padding: 22px; cursor: pointer; transition: border-color .25s, transform .25s, box-shadow .25s;
  position: relative; overflow: hidden; }
.skill::before { content:""; position:absolute; inset:0 0 auto 0; height:2px;
  background: var(--accent); opacity:0; transition: opacity .25s; }
.skill:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
  box-shadow: 0 14px 40px rgba(0,0,0,0.45); }
.skill:hover::before, .skill.open::before { opacity: .85; }
.skill.open { border-color: color-mix(in srgb, var(--accent) 60%, var(--line)); }
.skill-top { display: flex; align-items: center; gap: 13px; }
.skill-glyph { width: 46px; height: 46px; border-radius: 11px; background: var(--bg-2);
  border: 1px solid var(--line); display: grid; place-items: center; flex-shrink: 0; }
.skill-id { flex: 1; min-width: 0; }
.skill-cmd { display: block; font-family: var(--mono); font-size: 15px; font-weight: 700; color: #fff; }
.skill-tag { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: .2px; }
.skill-chev { font-family: var(--mono); font-size: 22px; color: var(--ink-mute); line-height: 1; }
.skill-blurb { color: var(--ink-dim); font-size: 14px; line-height: 1.55; margin: 16px 0 0; }
.skill-steps { overflow: hidden; transition: max-height .4s cubic-bezier(.3,.8,.3,1); }
.skill-steps ol { list-style: none; margin: 16px 0 2px; padding: 14px 0 0; border-top: 1px solid var(--line-soft); }
.skill-steps li { display: flex; gap: 11px; align-items: flex-start; font-size: 13px; color: var(--ink-dim);
  line-height: 1.45; padding: 7px 0; }
.skill-steps .num { font-family: var(--mono); font-size: 11px; color: var(--accent); border: 1px solid var(--line);
  border-radius: 5px; padding: 1px 6px; flex-shrink: 0; margin-top: 1px; }

/* frameworks */
.fw { background: linear-gradient(180deg, var(--panel), var(--bg-1)); border: 1px solid var(--line-soft);
  border-radius: 16px; overflow: hidden; }
.fw-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line-soft); background: var(--bg-2); }
.fw-tab { flex: 1; font-family: var(--mono); font-size: 14px; color: var(--ink-mute); background: none;
  border: none; border-bottom: 2px solid transparent; padding: 16px 10px; cursor: pointer; transition: all .2s; }
.fw-tab:hover { color: var(--ink-dim); background: rgba(138,150,255,0.04); }
.fw-tab.on { color: #fff; border-bottom-color: var(--glow); background: rgba(138,150,255,0.07); }
.fw-panel { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; padding: 30px 30px 32px; }
.fw-scenario { font-family: var(--display); font-weight: 700; font-size: 24px; color: #fff; letter-spacing: -.5px; }
.fw-blurb { color: var(--ink-dim); font-size: 15px; line-height: 1.6; margin: 12px 0 18px; }
.fw-docs { display: flex; flex-wrap: wrap; gap: 8px; }
.doc-pill { font-family: var(--mono); font-size: 12px; color: var(--ink-dim); text-decoration: none;
  background: var(--bg-2); border: 1px solid var(--line); border-radius: 7px; padding: 5px 10px; transition: all .18s; }
.doc-pill:hover { color: var(--glow-bright); border-color: var(--glow); }
.fw-run { background: var(--bg-0); border: 1px solid var(--line-soft); border-radius: 12px; padding: 18px; }
.fw-run-label { font-family: var(--mono); font-size: 11px; color: var(--ink-mute); text-transform: uppercase;
  letter-spacing: 1.5px; margin-bottom: 12px; }

/* principles */
.principles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.principle { position: relative; background: var(--panel-2); border: 1px solid var(--line-soft);
  border-radius: var(--r); padding: 24px 26px; transition: border-color .2s; }
.principle:hover { border-color: var(--line); }
.p-idx { font-family: var(--mono); font-size: 12px; color: var(--glow); opacity: .8; }
.principle h3 { font-family: var(--display); font-size: 19px; margin: 8px 0 8px; letter-spacing: -.3px; }
.principle p { margin: 0; color: var(--ink-dim); font-size: 14px; line-height: 1.55; }

/* endcap */
.endcap { display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;
  background: linear-gradient(110deg, var(--navy), var(--bg-1) 70%); border: 1px solid var(--line);
  border-radius: 18px; padding: 34px 36px; box-shadow: inset 0 0 60px rgba(47,61,122,0.25); }
.endcap h2 { font-family: var(--display); font-size: 27px; margin: 0 0 8px; letter-spacing: -.5px; }
.endcap p { margin: 0; color: var(--ink-dim); font-size: 15px; }
.endcap-cmd { min-width: 340px; flex: 1; max-width: 460px; }

/* footer */
.foot { display: flex; align-items: center; gap: 12px; padding: 26px 28px 44px;
  border-top: 1px solid var(--line-soft); margin-top: 30px; font-family: var(--mono);
  font-size: 13px; color: var(--ink-mute); }
.foot a { color: var(--ink-dim); text-decoration: none; }
.foot a:hover { color: var(--glow-bright); }
.dot-sep { color: var(--line); }
.foot-end { margin-left: auto; color: var(--ink-mute); }

/* responsive */
@media (max-width: 940px) {
  .hero { grid-template-columns: 1fr; min-height: 0; padding-top: 50px; }
  .hero-loop { max-width: 480px; margin: 0 auto; }
  .skills { grid-template-columns: 1fr; }
  .fw-panel { grid-template-columns: 1fr; }
  .principles { grid-template-columns: 1fr; }
  .nav-links { gap: 16px; }
  .nav-links a:not(.nav-gh) { display: none; }
}
`}</style>;
}
window.AppStyles = AppStyles;
