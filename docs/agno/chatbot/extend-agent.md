# Agno Chatbot — Extend Agent

Add a new capability, tool, or behaviour to an existing Agno chatbot agent without breaking existing functionality.

---

## Preconditions

- The agent exists at `agents/<slug>/agent.py` and passes its current test suite.
- You know what capability you want to add.
- You have access to the Agno docs MCP server (optional but strongly recommended).

---

## Step 1 — Define the Extension

Confirm with the user:

1. **What capability?** Examples:
   - New tool: web search, email sending, calendar access, SQL query, image generation
   - Structured output: return a Pydantic model instead of plain text
   - Memory upgrade: enable long-term user memory
   - Multi-modal: accept images or audio input
   - MCP integration: connect to an external MCP server
   - Human-in-the-loop: require confirmation before executing a sensitive action

2. **Trigger condition** — When should the new capability be used?
3. **Output change** — Does the response format change?
4. **Constraints** — What must the new capability NOT do?

---

## Step 2 — Search Agno Docs for the Right API

Use the Agno MCP server to find the correct implementation:

```
Search: "<capability keyword>"
Example: "memory long-term user storage"
Example: "MCP tools connection"
Example: "structured output Pydantic"
```

Key Agno docs sections to check:
- `/tools/` — built-in toolkits (120+ available)
- `/tools/mcp/` — MCP server integration
- `/memory/` — memory configuration options
- `/input-output/structured-output/` — Pydantic output models
- `/hitl/` — human-in-the-loop patterns
- `/multimodal/` — image/audio/video input

---

## Step 3 — Plan the Change

Write out the plan before touching code:

```
EXTENSION PLAN
==============
New capability: <name>
Files to create: <list>
Files to modify: agents/<slug>/agent.py

Changes to agent.py:
  - Add import: from agno.tools.<module> import <ToolClass>
  - Add to tools=[]: <ToolClass>()
  - Add to INSTRUCTIONS: "<trigger condition and usage rule>"

New probes to add:
  1. Input: "<probe that exercises new capability>"
     Expected: <tool is called / output format matches>
  2. Input: "<edge case for new capability>"
     Expected: <graceful handling>
```

Show the plan to the user and get confirmation.

---

## Step 4 — Implement

### 4a — Adding a New Tool

**Built-in toolkit (easiest):**

```python
# Find the toolkit in Agno docs, then:
from agno.tools.<module> import <ToolkitClass>

agent = Agent(
    ...
    tools=[..., <ToolkitClass>()],
)
```

**Custom tool (function-based):**

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

Critical: the docstring IS the tool spec for the LLM. Make it precise.

**MCP server tool:**

```python
from agno.tools.mcp import MCPTools

# In an async context (AgentOS or arun):
mcp = MCPTools(transport="streamable-http", url="<mcp_server_url>")
# Or for stdio-based servers:
mcp = MCPTools(command="npx -y @modelcontextprotocol/<server-name>")
```

### 4b — Adding Structured Output

```python
from pydantic import BaseModel, Field

class ChatbotResponse(BaseModel):
    answer: str = Field(description="The main response text")
    confidence: float = Field(description="Confidence score 0.0–1.0")
    sources: list[str] = Field(default=[], description="Tool results cited")

agent = Agent(
    ...
    output_model=ChatbotResponse,
)
```

### 4c — Upgrading Memory

```python
# Long-term user memory (automatic, runs at end of each conversation)
agent = Agent(
    ...
    update_memory_on_run=True,
    # agent now extracts and stores user facts after every run
)

# For real-time memory updates (more powerful but 8x more expensive):
agent = Agent(
    ...
    enable_agentic_memory=True,
    # Use a cheaper model for memory operations to reduce cost:
    # memory_manager=MemoryManager(model=Claude(id="claude-haiku-4-5-20251001"))
)
```

### 4d — Human-in-the-Loop Confirmation

Require user confirmation before executing a sensitive tool:

```python
from agno.tools import tool

@tool(requires_confirmation=True)  # pauses run for approval
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email to the specified recipient.

    Args:
        to: Recipient email address.
        subject: Email subject line.
        body: Email body text.
    """
    # implementation
    return f"Email sent to {to}"
```

---

## Step 5 — Update INSTRUCTIONS

Add a section for the new capability:

```python
INSTRUCTIONS = """
...existing content...

## <New Capability Name>
<Trigger condition>: Use <tool_name> when the user asks about <specific topic>.
<Constraint>: Never use <tool_name> for <excluded purpose>.
<Output note>: When using <tool_name>, always cite the result source.
"""
```

---

## Step 6 — Validate

Run the full probe suite from `improve-agent.md` first to confirm no regressions.

Then run the 2 new probes:

```python
from agents.<slug>.agent import agent

# New capability probe 1
response = agent.run("<input_that_triggers_new_capability>", stream=False)
assert response.content is not None
# If tool call required:
tool_names = [m.tool_name for m in response.messages if hasattr(m, 'tool_name')]
assert "<new_tool_name>" in tool_names

# New capability probe 2 (edge case)
response = agent.run("<edge_case_input>", stream=False)
assert "error" not in response.content.lower()
```

---

## Step 7 — Commit

```bash
git add agents/<slug>/agent.py tools/<new_tool_file>.py
git commit -m "feat(<slug>): add <capability-name> via <tool_name>"
```

---

## Success Criteria

- New capability works on at least 2 new probes.
- All existing probes still pass.
- INSTRUCTIONS describe the new capability and its trigger condition.
- No bare exceptions or unhandled errors in debug logs.
