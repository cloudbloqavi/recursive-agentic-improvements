# LangGraph Multi-Agent Supervisor — Extend Agent

Add new specialist agents, better state management, or parallel execution to a LangGraph multi-agent supervisor.

---

## Common Extensions

### Extension A — Add a New Specialist Agent

1. Create `src/<slug>/agents/<new-agent>.py` following the existing pattern.
2. Add the node to `graph.py`.
3. Add a routing description to `SUPERVISOR_SYSTEM`.
4. Add an edge: `workflow.add_edge("<new-agent>", "supervisor")`.

### Extension B — Parallel Agent Execution

Run multiple agents simultaneously instead of sequentially:

```python
from langgraph.constants import Send

def supervisor_parallel(state: SupervisorState) -> list[Send]:
    """Fan out to multiple agents in parallel."""
    # Supervisor decides which agents to call simultaneously
    agents_to_call = ["researcher", "analyst"]  # determined by LLM or logic
    return [Send(agent, state) for agent in agents_to_call]

workflow.add_conditional_edges("supervisor", supervisor_parallel, ["researcher", "analyst"])
```

### Extension C — Add Subgraph Composition

Wrap the multi-agent system as a subgraph that can be embedded in a larger graph:

```python
# Compile the multi-agent graph as a subgraph
multi_agent_subgraph = build_graph()

# Use it as a node in a parent graph
parent_workflow = StateGraph(ParentState)
parent_workflow.add_node("multi_agent_system", multi_agent_subgraph)
```

### Extension D — Add Inter-Agent Memory

Share findings between agents using a shared state field:

```python
class SupervisorState(TypedDict):
    messages: Annotated[list, add_messages]
    next_agent: str
    research_findings: str    # populated by researcher, used by analyst
    analysis_results: str     # populated by analyst, used by writer
    final_output: str         # populated by writer
```

Update each agent to read and write its designated field.

---

## Validation

1. New agent probe: task that routes exclusively to the new agent.
2. Integration probe: task requiring old agents + new agent.
3. Regression: 2 existing probes still pass.

---

## Commit

```bash
git add src/<slug>/
git commit -m "feat(<slug>): add <extension-name> to multi-agent supervisor"
```
