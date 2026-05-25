# Create New Agent — Universal Entry Point

This is the top-level runbook. Claude Code reads this file, asks the user a few questions, selects the appropriate framework-specific guide, and delegates to it.

---

## Preconditions

- You are inside a git repository with a working framework installation.
- Claude Code is authenticated and running in the project root.
- At least one LLM API key is set in your environment (e.g., `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`).

---

## Step 1 — Gather Requirements

Ask the user the following questions (ask them all at once, do not ask one by one):

1. **What should this agent do?** — Describe the job in 1–3 sentences.
2. **Which framework are you using?** — Agno / CrewAI / LangGraph / Google ADK / Other.
3. **What is the primary use case?** — Choose or describe:
   - Chatbot / conversational assistant
   - Research assistant (web search, document analysis)
   - Content generation / writing pipeline
   - Data analysis / code execution
   - Customer support / FAQ
   - Multi-agent team / workflow orchestration
   - Other (describe)
4. **What tools does it need?** — Web search, database, code executor, APIs, etc.
5. **Does it need memory across sessions?** — Yes / No.
6. **Should it work standalone or as part of a team?** — Standalone / Part of a multi-agent system.

---

## Step 2 — Validate Framework and Tooling

Based on the user's answers, confirm:

- The framework package is installed:
  - Agno: `python -c "import agno; print(agno.__version__)"`
  - CrewAI: `python -c "import crewai; print(crewai.__version__)"`
  - LangGraph: `python -c "import langgraph; print(langgraph.__version__)"`
  - Google ADK: `python -c "from google.adk.agents import LlmAgent; print('ok')"`
- API keys are present: `echo $ANTHROPIC_API_KEY` (or equivalent for chosen provider).
- If the framework is not installed, show the correct install command and stop.

---

## Step 3 — Select the Specific Guide

Map the framework + use case to the correct subdirectory:

| Framework | Use Case | Guide Path |
|---|---|---|
| Agno | Chatbot | `docs/agno/chatbot/create-new-agent.md` |
| Agno | Research Assistant | `docs/agno/research-assistant/create-new-agent.md` |
| CrewAI | Research Crew | `docs/crewai/research-crew/create-new-agent.md` |
| CrewAI | Content Pipeline | `docs/crewai/content-pipeline/create-new-agent.md` |
| LangGraph | ReAct Agent | `docs/langgraph/react-agent/create-new-agent.md` |
| LangGraph | Multi-Agent Supervisor | `docs/langgraph/multi-agent-supervisor/create-new-agent.md` |
| Google ADK | Chatbot | `docs/google-adk/chatbot/create-new-agent.md` |
| Google ADK | Tool-Using Agent | `docs/google-adk/tool-using-agent/create-new-agent.md` |

If the use case does not map exactly, pick the closest match and note the deviation.

---

## Step 4 — Create a Feature Branch

```bash
git checkout -b agent/<agent-slug>
```

Replace `<agent-slug>` with a kebab-case name derived from the agent's purpose (e.g., `agent/research-assistant`, `agent/customer-support-bot`).

---

## Step 5 — Follow the Framework-Specific Guide

Read and execute the selected guide from Step 3. Pass the gathered requirements from Step 1 as context so the guide does not need to re-ask.

---

## Step 6 — Run Smoke Tests & Mocked Test Suite

After the agent is created, run the smoke tests defined in the framework-specific guide. In addition, write and run a mocked test suite under `tests/test_<slug>.py` conforming to the [Test Constitution](../tests/TEST_CONSTITUTION.md).

A passing smoke test and test suite means:
- The agent starts without errors.
- It responds to at least one golden-path prompt correctly.
- The mocked test suite `tests/test_<slug>.py` covers static assertions and mocked behavioral happy paths.
- Running `pytest tests/` returns success for all tests.
- No import errors, missing API keys, or tool failures appear in the logs.

---

## Step 7 — Commit

```bash
# Stage both agent files and test suite files
git add agents/ config/ src/ tests/test_<slug>.py  # adjust to project structure
git add -f tests/test_<slug>.py                    # force add if excluded
git commit -m "feat: scaffold <agent-name> agent and mocked test suite"
```

---

## Success Criteria

- Agent file(s) exist with valid syntax.
- Agent responds correctly to the smoke-test prompt.
- Mocked test suite `tests/test_<slug>.py` is created conforming to the Test Constitution.
- Running `pytest tests/` passes successfully.
- No unhandled errors in logs.
- Changes committed on a feature branch.
