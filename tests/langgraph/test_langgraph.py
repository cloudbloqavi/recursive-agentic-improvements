import pytest
from tests.langgraph.agent import graph as langgraph_graph

def test_langgraph_graph():
    assert langgraph_graph is not None
    assert "tools" in langgraph_graph.nodes
