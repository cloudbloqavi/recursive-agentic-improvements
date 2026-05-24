import pytest
from tests.google_adk.agent import root_agent as adk_agent

def test_google_adk_agent():
    assert adk_agent.name == "weather_agent"
    assert len(adk_agent.tools) == 1
    assert adk_agent.tools[0].__name__ == "fetch_weather"
