# /extend-agent — Add a New Capability to an Existing Agent

Add a new tool, behaviour, mode, or integration to an existing agent without breaking what already works.

**Usage:** `/extend-agent [framework] [agent-path]`
**Examples:**
- `/extend-agent agno agents/my-bot/agent.py`
- `/extend-agent crewai src/my-crew`
- `/extend-agent langgraph src/my-agent`
- `/extend-agent google-adk my_agent`
- `/extend-agent` (will ask)

---

## Step 1 — Clarify the Extension

If `$ARGUMENTS` is provided, parse framework and agent path. Ask the user all remaining questions at once:

1. **Which agent are you extending?** File path and framework.
2. **What new capability do you want to add?** Examples:
   - A new tool (web search, email, database query, API call, code execution)
   - Structured output (return a Pydantic model / typed dict instead of plain text)
   - Memory upgrade (enable long-term user memory)
   - Multi-modal input (accept images, audio)
   - MCP server integration
   - Human-in-the-loop confirmation for sensitive actions
   - A new agent/role added to an existing crew
   - A new specialist node added to a LangGraph multi-agent graph
3. **Why is this needed?** What user problem does it solve?
4. **Are there constraints?** Things the new capability must NOT do.

---

## Step 2 — Understand the Current Agent

Before changing anything:

1. Read the full spec (INSTRUCTIONS / INSTRUCTION / SYSTEM_PROMPT / agents.yaml + tasks.yaml).
2. Read all tool definitions and their docstrings.
3. Note the current output format and any constraints.
4. Identify where the new capability fits in the existing flow.
5. Check what imports and dependencies are already in place.

---

## Step 3 — Search Framework Documentation

**Before searching**, check if the recommended MCP server is available for the chosen framework. The extend workflow depends heavily on current API patterns — using training-data knowledge risks broken imports, wrong parameter names, or deprecated patterns.

For the chosen framework, attempt to call the MCP tool below now:

| Framework | MCP tool to try | What it covers |
|---|---|---|
| Agno | `search_agno` or `query_docs_filesystem_agno` | All Agno APIs — 120+ tools, memory, structured output, HITL, MCP integration |
| LangGraph | `search_docs_by_lang_chain` or `query_docs_filesystem_docs_by_lang_chain` | LangGraph nodes, edges, tools, interrupts, sub-graphs |
| Google ADK | WebFetch `https://google.github.io/adk-docs/llms.txt` | Full ADK reference — agent-as-tool, callbacks, sub-agents |
| CrewAI | WebFetch `https://docs.crewai.com/llms.txt` | Full CrewAI docs — agents, tasks, tools, process types |

**If the Agno MCP tool is not available**, output this warning and stop the doc search step:
```
⚠ Agno docs MCP not detected. This is critical for /extend-agent —
  without live docs, generated tool imports and API patterns will be
  based on training data and may not match the installed agno version.

  To fix: add to .claude/settings.json under "mcpServers":

    "agno-docs": {
      "type": "http",
      "url": "https://docs.agno.com/mcp"
    }

  Restart Claude Code and re-run /extend-agent.

  Alternatively, continue and manually verify all generated imports
  against your installed agno version: python -c "import agno; help(agno)"
```
Then ask the user: "MCP is not available. Do you want to continue without live docs (generated code may need manual verification), or stop and configure MCP first?"

**If the LangGraph MCP tool is not available**, output:
```
⚠ LangChain/LangGraph docs MCP not detected.
  Generated graph and tool code may use outdated APIs.
  Setup: https://docs.smith.langchain.com/how_to_guides/mcp
  Add to .claude/settings.json under "mcpServers", restart Claude Code.

  Alternatively, continue and verify all generated code against:
  https://langchain-ai.github.io/langgraph/
```
Then ask the user whether to continue or stop.

**If Google ADK or CrewAI WebFetch fails**, output a brief warning noting that doc lookups will use training data, then continue.

**If MCP / WebFetch is available**, use it for every API lookup in the steps below. Do not rely on training-data memory for any specific class name, parameter name, or import path.

Use the available MCP server or Context7 to find the correct API for the new capability. Do not implement from memory — always verify against current docs.

Key documentation sections by framework:

**Agno**
- Built-in toolkits: `/tools/` — 120+ available (check before writing custom)
- MCP integration: `/tools/mcp/`
- Memory options: `/memory/`
- Structured output: `/input-output/structured-output/`
- Human-in-the-loop: `/hitl/`
- Multi-modal: `/multimodal/`

**CrewAI**
- Built-in tools: `crewai_tools` package
- Custom tools: `@tool` decorator
- Adding agents: new entry in `agents.yaml` + new `@agent` method in `crew.py`
- Adding tasks: new entry in `tasks.yaml` + new `@task` method
- Process types: `Process.sequential`, `Process.hierarchical`

**LangGraph**
- Tool pattern: `@tool` decorator from `langchain.tools`
- Adding nodes: `workflow.add_node()`
- Custom state fields: extend `TypedDict` in `state.py`
- Interrupt for human-in-the-loop: `interrupt()` from `langgraph.types`
- Sub-graphs: compile a new `StateGraph`, use as a node

**Google ADK**
- Any Python function is a tool — ADK auto-wraps it
- Sub-agents: create an `LlmAgent` and add it to another agent's `tools`
- Agent-as-tool pattern for routing
- `before_model_callback` / `after_tool_callback` for hooks

---

## Step 4 — Plan the Change

Before writing code, write out the plan and show it to the user for confirmation:

```
EXTENSION PLAN
==============
Framework: <framework>
Agent/crew: <path>
New capability: <name>

Files to create:
  - <list any new files>

Files to modify:
  - <agent/tools file>: <specific changes>
  - <spec/config file>: <specific changes>

Spec/instruction additions:
  "<exact text to add to INSTRUCTIONS / agent.yaml goal / etc.>"

New test probes (at least 2):
  1. Input: "<input that exercises new capability>"
     Expected: <tool is called / format matches / behaviour observed>
  2. Input: "<edge case for new capability>"
     Expected: <graceful handling>
```

**Wait for user confirmation before implementing.**

---

## Step 5 — Implement

Follow the framework-specific implementation patterns below.

---

### AGNO — Implementing Extensions

#### Adding a built-in tool

```python
# Find the toolkit in Agno docs, then:
from agno.tools.<module> import <ToolkitClass>

agent = Agent(
    ...
    tools=[..., <ToolkitClass>()],
)
```

Common built-in toolkits: `DuckDuckGoTools`, `YFinanceTools`, `GoogleMapsTools`,
`EmailTools`, `SlackTools`, `GithubTools`, `CalCalculatorTools`, `PythonTools`.

#### Adding a custom tool

```python
from agno.tools import tool

@tool()
def my_new_tool(param: str) -> str:
    """One-line description of what this tool does.

    Args:
        param: Description of what this parameter is for.

    Returns:
        Description of the return value.
    """
    # implementation
    return result
```

The docstring IS the tool spec for the LLM. Make it precise: when to call it, what it does, what it returns.

#### Adding an MCP server tool

```python
from agno.tools.mcp import MCPTools

# Streamable HTTP server:
mcp = MCPTools(transport="streamable-http", url="<mcp_server_url>")

# stdio-based server:
mcp = MCPTools(command="npx -y @modelcontextprotocol/<server-name>")
```

Use `async with mcp` in an `arun()` context.

#### Adding structured output

```python
from pydantic import BaseModel, Field

class AgentResponse(BaseModel):
    answer: str = Field(description="The main response text")
    confidence: float = Field(description="Confidence score 0.0–1.0")
    sources: list[str] = Field(default=[], description="Tool results cited")

agent = Agent(..., output_model=AgentResponse)
```

#### Adding long-term memory

```python
# Automatic memory extraction after each run (low cost):
agent = Agent(..., update_memory_on_run=True)

# Real-time memory during conversation (8x more expensive):
agent = Agent(..., enable_agentic_memory=True)
```

#### Adding human-in-the-loop

```python
from agno.tools import tool

@tool(requires_confirmation=True)   # pauses run for user approval
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email. Requires user confirmation before executing."""
    # implementation
    return f"Email sent to {to}"
```

#### Update INSTRUCTIONS

Add a dedicated section for the new capability:

```python
INSTRUCTIONS = """
...existing content...

## <New Capability Name>
Trigger: Use `<tool_name>` when the user asks about <specific topic>.
Constraint: Never use `<tool_name>` for <excluded purpose>.
Output: When using `<tool_name>`, always cite the result source.
"""
```

---

### CREWAI — Implementing Extensions

#### Adding a new tool to an existing agent

```python
# crew.py
from crewai_tools import SerperDevTool, GithubSearchTool

@agent
def senior_researcher(self) -> Agent:
    return Agent(
        config=self.agents_config["senior_researcher"],
        tools=[
            SerperDevTool(),
            GithubSearchTool(),   # ← new tool
        ],
    )
```

Update the agent's `goal` in `agents.yaml` to include when to use the new tool.

#### Adding a new agent and task

1. Add the new agent to `config/agents.yaml`:
```yaml
fact_checker:
  role: Research Fact Checker
  goal: >
    Verify the accuracy of all factual claims in the research brief for {topic}.
    Flag any claims that cannot be independently confirmed.
  backstory: >
    You are a meticulous fact-checker with 10 years of experience in journalism.
    You verify every claim against at least 2 independent sources.
  verbose: true
  allow_delegation: false
  llm: anthropic/claude-sonnet-4-6
```

2. Add the new task to `config/tasks.yaml`:
```yaml
fact_checking_task:
  description: >
    Verify all factual claims in the research brief for {topic}.
    For each major claim, confirm it with at least 2 independent sources.
    Mark verified claims as [VERIFIED] and unverifiable ones as [UNVERIFIED].
  expected_output: >
    The research brief with all claims annotated [VERIFIED] or [UNVERIFIED],
    plus a summary of verification results.
  agent: fact_checker
  context:
    - research_task   # receives research output
```

3. Add the agent and task methods to `crew.py`:
```python
@agent
def fact_checker(self) -> Agent:
    return Agent(config=self.agents_config["fact_checker"],
                 tools=[SerperDevTool()], verbose=True)

@task
def fact_checking_task(self) -> Task:
    return Task(config=self.tasks_config["fact_checking_task"])
```

4. Update the Crew's task list order to insert the new task in the right place.

---

### LANGGRAPH — Implementing Extensions

#### Adding a new tool to a ReAct agent

```python
# src/<slug>/tools.py

@tool
def new_capability_tool(param: str) -> str:
    """What this tool does and when to use it.

    Use this tool when the user asks about <specific condition>.
    Do NOT use this for <excluded condition>.

    Args:
        param: Description of the parameter.

    Returns:
        Description of return value.
    """
    # implementation
    return result
```

Then add to the tools list in `agent.py`:
```python
from src.<slug>.tools import web_search, new_capability_tool

graph = create_react_agent(
    model=model,
    tools=[web_search, new_capability_tool],   # ← add here
    state_modifier=SYSTEM_PROMPT,
    checkpointer=checkpointer,
)
```

Update `SYSTEM_PROMPT` to describe the new tool and when to use it.

#### Adding a new specialist node to a supervisor graph

1. Create `src/<slug>/agents/<new_specialist>.py` following the same pattern as existing specialists.
2. Import and add the node to `graph.py`:
```python
from src.<slug>.agents.<new_specialist> import <new_specialist>_node

workflow.add_node("<new_specialist>", <new_specialist>_node)
workflow.add_edge("<new_specialist>", "supervisor")
```
3. Update `SUPERVISOR_SYSTEM` in `supervisor.py` to include the new agent in routing rules.

#### Adding custom state fields

```python
# src/<slug>/state.py
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    new_field: str    # ← add new fields here
```

#### Adding human-in-the-loop interrupts

```python
from langgraph.types import interrupt

def confirmation_node(state: dict) -> dict:
    """Ask human to confirm before proceeding."""
    decision = interrupt({"question": "Proceed with this action?", "action": state["pending_action"]})
    return {"human_approved": decision == "yes"}
```

Add to graph with: `workflow.add_node("confirm", confirmation_node)`.

---

### GOOGLE ADK — Implementing Extensions

#### Adding a new tool function

```python
# <agent_slug>/tools/<new_domain>_tools.py

def new_tool(param: str) -> dict:
    """What this tool does.

    Use this tool when the user asks about <specific condition>.

    Args:
        param: Description.

    Returns:
        A dict with keys: ...
    """
    # implementation
    return {"result": "..."}
```

Add to `root_agent` in `agent.py`:
```python
from <agent_slug>.tools.<new_domain>_tools import new_tool

root_agent = LlmAgent(
    ...
    tools=[..., new_tool],   # ← add here
)
```

Update `INSTRUCTION` to describe the new tool and its trigger condition.

#### Adding a sub-agent (agent-as-tool pattern)

```python
from google.adk.agents import LlmAgent

specialist_agent = LlmAgent(
    name="specialist_agent",
    model="gemini-2.5-flash",
    instruction="You are a specialist in <domain>. <task description>.",
    tools=[specialist_tool_1, specialist_tool_2],
)

root_agent = LlmAgent(
    name="orchestrator",
    model="gemini-2.5-flash",
    instruction="""...(existing instruction)...
    
## Sub-Agents
- `specialist_agent`: Use when the user needs <specialized capability>.
""",
    tools=[..., specialist_agent],   # LlmAgent instances can be passed as tools
)
```

---

## Step 6 — Validate the Extension

### Part A — Regression check

Run the full probe suite from `/improve-agent` to confirm no regressions.

If `/improve-agent` has not been run before, run at least these regression checks:
- One golden-path probe that worked before
- One constraint probe (must-not rule)
- One tool-selection probe (existing tool, not the new one)

### Part B — New capability probes

Run the 2+ new probes from Step 4:

```python
# Probe for new capability
response = agent.run("<input that triggers new capability>", stream=False)
assert response.content is not None

# If tool call required, verify it was called:
tool_names = [m.tool_name for m in response.messages if hasattr(m, 'tool_name')]
assert "<new_tool_name>" in tool_names, "New tool was not called"

# Edge case probe
response = agent.run("<edge case for new capability>", stream=False)
assert "error" not in response.content.lower(), "Edge case not handled gracefully"
```

For CrewAI: verify the new agent appears in the output and its task output is populated.
For LangGraph: check LangSmith trace shows the new node was invoked.
For Google ADK: check debug logs confirm the new tool function was called.

### Part C — Check for regressions in logs

Scan logs for any new warnings, errors, or unexpected behaviour that was not present before.

---

## Step 7 — Update Documentation

If the project has a README or agent documentation file, add a note:

```markdown
### <New Capability Name>

<One-sentence description of what it does and when it's triggered.>
```

---

## Step 8 — Commit

```bash
# Agno
git add agents/<slug>/agent.py tools/<new-tool>.py
git commit -m "feat(<slug>): add <capability-name> via <tool-or-module>"

# CrewAI
git add src/<crew_slug>/config/ src/<crew_slug>/crew.py
git commit -m "feat(<crew-slug>): add <new-agent-or-tool> capability"

# LangGraph
git add src/<slug>/
git commit -m "feat(<slug>): add <capability-name> tool/node"

# Google ADK
git add <agent_slug>/
git commit -m "feat(<agent-slug>): add <capability-name>"
```

---

## Success Criteria

- New capability works correctly on at least 2 new probes.
- All previously passing probes still pass (no regressions).
- Spec (INSTRUCTIONS / INSTRUCTION / SYSTEM_PROMPT / agents.yaml) accurately describes the new capability and its trigger condition.
- No bare exceptions or unhandled errors in debug logs.
- Changes committed with a descriptive message.
