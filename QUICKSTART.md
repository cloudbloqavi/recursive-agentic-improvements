# 🚀 Quickstart Guide: Recursive Agentic Improvements

Welcome! This guide is designed to get you up and running with **Recursive Agentic Improvements** in under 5 minutes. Even if you have never built an AI agent before, this guide will take you step-by-step from zero to launching and improving production-grade agents.

---

## 🎨 Project Overview & Architecture

To help you visualize how this repository fits into your development workflow, here is a conceptual diagram of the **Recursive Agentic Self-Improvement Loop**:

![Agent Improvement Loop](docs/assets/hero_concept.png)

This repository provides Claude Code **skills** (slash commands) that you install into your own python projects. These skills empower Claude Code to act as an expert agent engineer, automating the research, scaffolding, testing, and optimization of agents.

---

## 🧠 AI Agent Engineering 101 (For Beginners)

Before we start coding, let's break down the core concepts of agentic systems into plain English:

| Term | What it is | Real-World Analogy |
|---|---|---|
| **AI Agent** | An LLM configured with a specific role, instructions, and tools to accomplish tasks autonomously. | A specialized virtual employee. |
| **System Prompt (Instructions)** | The core blueprint, rules of behavior, goals, and constraints given to the agent. | A detailed employee handbook. |
| **Tools (Functions)** | Python functions the agent can decide to run to fetch data, perform calculations, or interact with external APIs. | A computer with internet access and calculators. |
| **State & Memory** | The ability to remember past messages or facts within or across sessions. | A notepad to write down client details during a conversation. |
| **Mock-Based Testing** | Running tests with predefined mock model outputs instead of calling expensive live LLM APIs. | A flight simulator to test a pilot before letting them fly a real plane. |

---

## 🔄 How the Skills Work

Here is how the custom Claude Code commands manage your agent lifecycle:

### 1. The /create-agent Pipeline (Research ➔ Plan ➔ Scaffold)
```mermaid
graph TD
    A[Start /create-agent] --> B[Phase 1: Docs & Tools Research]
    B --> B1[Query Framework MCP/Docs]
    B --> B2[Analyze Tool Gaps]
    B --> C[Phase 2: Generate Agent Blueprint]
    C --> C1[System Prompt Outline]
    C --> C2[Unit Test Plan]
    C --> D[Wait for Developer Approval]
    D -->|Approved| E[Phase 3: Scaffold Code & Tests]
    D -->|Rejected| A
    E --> E1[Generate Agent Files]
    E --> E2[Generate pytest File]
    E --> E3[Run Initial Smoke Probes]
```

### 2. The /improve-agent Loop (Recursive Self-Correction)
```mermaid
graph TD
    A[Start /improve-agent] --> B[Read System Instructions]
    B --> C[Derive 8-12 Test Probes]
    C --> C1[Golden Path Probes]
    C --> C2[Constraint / Adversarial Probes]
    C --> D[Run Probes Against Local Agent]
    D --> E{Did any fail?}
    E -->|Yes| F[Analyze Logs & Select Prompt Lever]
    F --> G[Modify Agent Instructions]
    G --> D
    E -->|No| H[Update Mocked Test Suite]
    H --> I[Verify pytest passes]
    I --> J[Commit to Feature Branch]
```

---

## ⚡ 5-Minute Installation & Setup

### Step 1: Install the Skills into Your Project
Navigate to your python agent project directory and run the installer via `npx`:

```bash
npx github:cloudbloqavi/recursive-agentic-improvements
```

This command creates a `.claude/commands/` directory containing the three skills (`create-agent.md`, `improve-agent.md`, `extend-agent.md`) and copies `TEST_CONSTITUTION.md` to your `tests/` directory.

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Ensure you set:
- `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY` / `GOOGLE_API_KEY`)

### Step 3: Set Up MCP Documentation Servers (Highly Recommended)
To allow Claude Code to inspect the latest framework documentation live, add the MCP servers to your global config (`~/.claude/settings.json`) or project config (`.claude/settings.json`):

```json
{
  "mcpServers": {
    "agno-docs": {
      "type": "http",
      "url": "https://docs.agno.com/mcp"
    },
    "langchain-docs": {
      "type": "http",
      "url": "https://docs.langchain.com/mcp"
    },
    "crewai-docs": {
      "type": "http",
      "url": "https://docs.crewai.com/mcp"
    }
  }
}
```
*Restart Claude Code after saving the config.*

---

## 🎮 Real-World Sandbox Scenarios

This repository contains static reference showcases in the `tests/` directory. Let's play with them to understand how each agentic framework works under the hood.

> [!TIP]
> Before running any sandbox script, install its dependencies. We recommend installing them directly in your active python environment or setting up a virtual environment.

### 📊 Scenario 1 (Agno) — The Calculator Agent
* **Where it is:** [tests/agno/](tests/agno/)
* **What it does:** Uses a custom `add_numbers` tool, remembers past calculations, and declines off-topic questions.
* **Run the Agent:**
  ```bash
  pip install -r tests/agno/requirements.txt
  python -m pytest tests/agno/
  ```

### 👥 Scenario 2 (CrewAI) — Market Research Crew
* **Where it is:** [tests/crewai/](tests/crewai/)
* **What it does:** Orchestrates a Senior Research Analyst agent and a Content Writer agent to write articles based on structured inputs.
* **Run the Agent:**
  ```bash
  pip install -r tests/crewai/requirements.txt
  python -m pytest tests/crewai/
  ```

### 🔗 Scenario 3 (LangGraph) — ReAct Agent
* **Where it is:** [tests/langgraph/](tests/langgraph/)
* **What it does:** Builds a stateful ReAct graph that registers a multiplication tool and persists conversation state with memory checkpointers.
* **Run the Agent:**
  ```bash
  pip install -r tests/langgraph/requirements.txt
  python -m pytest tests/langgraph/
  ```

### 🌤️ Scenario 4 (Google ADK) — Weather Assistant
* **Where it is:** [tests/google_adk/](tests/google_adk/)
* **What it does:** Demarcates Google ADK structural agent syntax (`root_agent` export) and binds custom tools like `fetch_weather`.
* **Run the Agent:**
  ```bash
  pip install -r tests/google_adk/requirements.txt
  python -m pytest tests/google_adk/
  ```

---

## 🛠️ Onboarding Checklist for Junior Developers

When you are ready to write or contribute to agents in this project, follow this simple checklist:

- [ ] **Research first:** Always run live search queries to check if the framework has updated its class structures.
- [ ] **Define clear rules:** Make sure your agent's system prompt has explicit constraints ("What You Must NOT Do").
- [ ] **Write Mocked Tests:** Always add static properties validation and behavioral assertions using mock responses to `tests/test_<slug>.py`.
- [ ] **Run pytest:** Keep the unit test suite clean and green by running `pytest tests/` before opening a pull request.
- [ ] **Git branching:** Create a feature branch (e.g. `agent/my-agent`) and commit surgical changes using conventional commit style.

---

## 💡 Need Help?
- Check the [Test Constitution](tests/TEST_CONSTITUTION.md) for testing guidelines.
- Ask Claude Code in the chat or type `/goal` if you want it to run automated agent development tasks end-to-end!
