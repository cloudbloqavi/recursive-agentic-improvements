# Extend Agent — Universal Entry Point

This runbook adds a new capability, tool, or behaviour to an existing agent. Unlike `improve-agent.md` (which fixes what is broken), this workflow adds something *new*.

---

## Preconditions

- The target agent exists and is passing its current test suite.
- You know what capability you want to add.
- The agent's `INSTRUCTIONS` clearly describe its current scope.

---

## Step 1 — Clarify the Extension

Ask the user:

1. **Which agent are you extending?** — File path and framework.
2. **What new capability do you want to add?** — Examples:
   - A new tool (e.g., send email, query database, call an API)
   - A new behaviour (e.g., cite sources, produce structured JSON output)
   - A new mode (e.g., handle voice input, support a new language)
   - Better memory or context handling
   - Human-in-the-loop confirmation for certain actions
3. **Why is this needed?** — What user problem does it solve?
4. **Are there constraints?** — Things the new capability must NOT do.

---

## Step 2 — Delegate to the Framework-Specific Guide

| Framework | Guide Path |
|---|---|
| Agno | `docs/agno/<use-case>/extend-agent.md` |
| CrewAI | `docs/crewai/<use-case>/extend-agent.md` |
| LangGraph | `docs/langgraph/<use-case>/extend-agent.md` |
| Google ADK | `docs/google-adk/<use-case>/extend-agent.md` |

---

## Universal Extension Process (applies to all frameworks)

### Phase A — Understand the Current Agent

1. Read the full `INSTRUCTIONS` / `instruction` string.
2. Read all tool definitions and their docstrings.
3. Note the current output format and any constraints.
4. Identify where the new capability fits in the existing flow.

### Phase B — Search Framework Documentation

Use the available MCP server or docs context to find:
- The correct API for the new tool or feature.
- Any built-in toolkits that already provide the capability.
- Code examples for the pattern you are implementing.
- Known limitations or gotchas.

Do not implement from memory — always verify against current docs.

### Phase C — Plan the Change

Before writing code, outline:

1. **New file(s) to create** (if any) — e.g., `tools/email.py`.
2. **Changes to the agent file** — new tools list entries, updated INSTRUCTIONS, new imports.
3. **INSTRUCTIONS additions** — new rules governing when and how to use the new capability.
4. **New test probes** — at least 2 probes that specifically exercise the new capability.

Show the plan to the user and get confirmation before implementing.

### Phase D — Implement

1. Create or modify tool file(s).
2. Update the agent definition to include the new tool(s).
3. Update `INSTRUCTIONS` to explain the new capability and its trigger conditions.
4. Ensure existing INSTRUCTIONS are not disrupted.

### Phase E — Validate & Update Test Suite

1. Run the existing probe suite from `improve-agent.md` — confirm no regressions.
2. Run the 2+ new probes targeting the new capability.
3. Check logs for unexpected errors or tool call failures.
4. If any probe fails, apply the fix loop from `improve-agent.md` Phase D.
5. Update `tests/test_<slug>.py` (conforming to the [Test Constitution](file:///c:/Users/aviji/repo/recursive-agentic-improvements/tests/TEST_CONSTITUTION.md)) by appending mocked test cases for the new capability.
6. Run `pytest tests/` to confirm that all test cases (both new capability checks and old regression checks) pass.

### Phase F — Update Documentation

If the project maintains a README or agent documentation file, add a short note describing the new capability.

---

## Step 3 — Commit

```bash
# Stage modified agent, tools, and test suite files
git add agents/<slug>.py tools/<new-tool>.py tests/test_<slug>.py  # adjust to project structure
git commit -m "feat(<agent-slug>): add <capability-name> capability"
```

---

## Success Criteria

- New capability works correctly on at least 2 new probes.
- All previously passing probes still pass (no regressions).
- INSTRUCTIONS accurately describe the new capability.
- Mocked test suite `tests/test_<slug>.py` is extended with tests for the new capability.
- Running `pytest tests/` returns success.
- Changes are committed with a descriptive message.
