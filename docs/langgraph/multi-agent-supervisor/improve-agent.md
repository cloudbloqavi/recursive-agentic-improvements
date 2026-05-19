# LangGraph Multi-Agent Supervisor — Improve Agent

Improve a LangGraph multi-agent supervisor system by testing routing decisions, agent handoffs, and output quality.

---

## Preconditions

- Multi-agent graph runs end-to-end.
- LangSmith tracing is enabled.

---

## Step 1 — Read the System Spec

From `supervisor.py`: routing rules and agent descriptions.
From each `agents/*.py`: each agent's SYSTEM prompt and tools.
From `state.py`: state structure and fields.

---

## Step 2 — Derive 10 Probes Targeting Routing

| # | Category | Probe Design |
|---|---|---|
| 1–2 | Golden path | Tasks requiring one agent (researcher only, writer only) |
| 3 | Golden path | Full pipeline task requiring all agents in sequence |
| 4 | Routing — direct | Simple question that should skip sub-agents (FINISH immediately) |
| 5 | Routing — wrong agent | Query likely to trigger wrong agent if routing logic is weak |
| 6 | Multi-step | Task requiring researcher → analyst → writer in sequence |
| 7 | Loops | Task that might cause supervisor to call same agent twice unnecessarily |
| 8 | Constraint | Verify sub-agents respect their own system prompts |
| 9 | Adversarial | Task name that confuses the router |
| 10 | Performance | Verify task completes in reasonable steps (not 10+ agent calls) |

---

## Step 3 — Diagnose Routing Problems from LangSmith

In LangSmith, examine the routing trace:

```
supervisor → [which agent?] → [back to supervisor] → [next agent?] → FINISH
```

Check for:
- **Wrong first agent**: supervisor sent task to wrong specialist
- **Missing handoff**: supervisor went to FINISH before all needed agents ran
- **Unnecessary loops**: same agent called multiple times for same data
- **Infinite loop**: supervisor never reaches FINISH

---

## Step 4 — Common Multi-Agent Supervisor Failures and Fixes

| Failure | Root Cause | Fix |
|---|---|---|
| Supervisor routes to wrong agent | Agent descriptions in routing prompt overlap | Sharpen each agent's description in SUPERVISOR_SYSTEM; add "DO NOT route to X for Y" rules |
| Supervisor routes to FINISH too early | "task complete" condition too broad | Add: "Route to FINISH ONLY when all required agents have run and the task is fully addressed." |
| Same agent called 3+ times | No loop prevention | Add to supervisor: "Do not call the same agent consecutively unless the user provides new information." |
| Sub-agent ignores its system prompt | Weak system prompt enforcement | Strengthen sub-agent system prompt; add explicit refusal rule |
| Long response chains for simple questions | No short-circuit for simple queries | Add to SUPERVISOR_SYSTEM: "For greetings, simple factual questions, or chitchat, route directly to FINISH without calling any specialist." |
| State lost between agent calls | State not threaded correctly | Verify `task_result` is populated and passed; check `add_messages` reducer is correct |
| Graph hangs on edge case | Missing conditional edge case | Add a default/fallback edge to END from supervisor |

---

## Step 5 — Apply Fixes

For routing fixes: edit `supervisor.py` SUPERVISOR_SYSTEM.
For sub-agent fixes: edit `agents/<agent>.py` system prompt or tools.
For graph structure fixes: edit `graph.py` edges.

---

## Step 6 — Re-run Failed Probes and Compare Experiments

```python
import asyncio
asyncio.run(aevaluate(
    target,
    data=f"<slug>-probes",
    evaluators=[correct, routing_correct],
    experiment_prefix="<slug>-supervisor-v2",
))
```

---

## Step 7 — Commit

```bash
git add src/<slug>/
git commit -m "improve(<slug>): fix routing decisions, prevent loops, 10/10 probes pass"
```
