import pytest
from tests.agno.agent_test import agent as agno_agent

def test_agno_agent():
    assert agno_agent.name == "calculator-agent"
    assert len(agno_agent.tools) == 1
    assert agno_agent.tools[0].__name__ == "add_numbers"
