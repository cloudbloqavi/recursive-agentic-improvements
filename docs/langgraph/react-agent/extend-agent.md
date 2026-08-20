# LangGraph ReAct Agent — Extend Agent

Add new tools, custom state, streaming, or persistence to an existing LangGraph ReAct agent.

---

## Preconditions

- Agent passes its current probe suite.
- LangSmith tracing is enabled.

---

## Common Extensions

### Extension A — Add a New Tool

```python
# src/<slug>/tools.py
from langchain.tools import tool

@tool
def query_database(sql_query: str) -> str:
    """Query the application database for structured data.

    Use this tool when the user asks for data that lives in the database:
    user counts, sales figures, inventory, or any tabular data.
    Do NOT use for general knowledge questions.

    Args:
        sql_query: A safe read-only SQL SELECT query.

    Returns:
        Query results as a formatted table string.
    """
    import sqlite3
    conn = sqlite3.connect("data/app.db")
    cursor = conn.execute(sql_query)
    rows = cursor.fetchall()
    cols = [d[0] for d in cursor.description]
    return "\n".join([str(cols)] + [str(row) for row in rows[:20]])
```

Update `graph` in `agent.py` to include the new tool:
```python
tools = [web_search, calculator, query_database]  # add here

graph = create_agent(
    model=model,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=checkpointer,
)
```

Add trigger condition to `SYSTEM_PROMPT`.

---

### Extension B — Add Custom State Fields

Extend beyond the default messages-only state:

```python
from langchain.agents import AgentState

class CustomState(AgentState):
    user_id: str                        # custom field
    session_metadata: dict              # custom field
    tool_call_count: int                # track usage
```

`create_agent` supports custom state directly via `state_schema` (the custom class must extend `AgentState` from `langchain.agents`, not a plain `TypedDict`) — no manual graph rebuild needed:

```python
graph = create_agent(
    model=model,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    state_schema=CustomState,
    checkpointer=checkpointer,
)
```

---

### Extension C — Add Streaming Support

Stream tokens as they are generated:

```python
# src/<slug>/run.py
import asyncio
from langchain_core.messages import HumanMessage
from src.<slug>.agent import graph

async def stream_run(message: str, thread_id: str = "default"):
    config = {"configurable": {"thread_id": thread_id}}
    async for event in graph.astream_events(
        {"messages": [HumanMessage(content=message)]},
        config=config,
        version="v2",
    ):
        kind = event["event"]
        if kind == "on_chat_model_stream":
            chunk = event["data"]["chunk"].content
            if chunk:
                print(chunk, end="", flush=True)
        elif kind == "on_tool_start":
            print(f"\n[Tool: {event['name']}({event['data']['input']})]")
        elif kind == "on_tool_end":
            print(f"[Result: {str(event['data']['output'])[:100]}]")

asyncio.run(stream_run("Tell me the latest AI news"))
```

---

### Extension D — Add Persistent Checkpointer (PostgreSQL)

Replace `MemorySaver` with a persistent backend for production:

```python
from langgraph.checkpoint.postgres import PostgresSaver
import psycopg

conn_string = "postgresql://user:pass@localhost:5432/agents"
with psycopg.connect(conn_string) as conn:
    checkpointer = PostgresSaver(conn)
    checkpointer.setup()

graph = create_agent(
    model=model,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=checkpointer,
)
```

---

### Extension E — Add Interrupt for Human-in-the-Loop

Pause the graph before executing a sensitive tool:

```python
from langchain.agents import create_agent

graph = create_agent(
    model=model,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=MemorySaver(),
    interrupt_before=["tools"],  # pause before any tool call
)

# Run until interrupt:
config = {"configurable": {"thread_id": "hitl-1"}}
result = graph.invoke({"messages": [HumanMessage(content="Delete all old logs")]}, config=config)
# result["__interrupt__"] contains the pending tool call for review

# After human approval, resume:
result = graph.invoke(None, config=config)
```

---

### Extension F — Deploy to LangGraph Cloud

```bash
pip install langgraph-cli
langgraph new my-agent --template new-langgraph-project-python
# configure langgraph.json
langgraph deploy
```

After deployment, access via SDK:
```python
from langgraph_sdk import get_client

client = get_client(url="<deployment-url>", api_key="<langsmith-key>")
async for chunk in client.runs.stream(None, "agent", input={"messages": [...]}, stream_mode="updates"):
    print(chunk.data)
```

---

## Validation After Extension

1. Run 2 probes targeting the new capability.
2. Run 2 existing probes as regression check.
3. Verify new tool appears in LangSmith traces.

---

## Commit

```bash
git add src/<slug>/
git commit -m "feat(<slug>): add <extension-name>"
```
