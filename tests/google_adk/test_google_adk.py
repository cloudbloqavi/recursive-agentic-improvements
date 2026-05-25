import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from tests.google_adk.agent import root_agent as adk_agent, fetch_weather
from tests.google_adk.run import run_agent

@pytest.mark.static
def test_google_adk_agent_static():
    """Verify static structural properties of the Google ADK weather agent."""
    assert adk_agent.name == "weather_agent"
    assert adk_agent.model == "gemini-2.5-flash"
    assert len(adk_agent.tools) == 1
    assert adk_agent.tools[0].__name__ == "fetch_weather"
    assert "weather assistant" in adk_agent.instruction.lower()

@pytest.mark.static
def test_fetch_weather_tool_isolated():
    """Verify that the fetch_weather tool operates correctly in isolation."""
    result = fetch_weather("London")
    assert isinstance(result, dict)
    assert "weather" in result
    assert "sunny and 22C in London" in result["weather"]

class MockPart:
    def __init__(self, text):
        self.text = text

class MockContent:
    def __init__(self, text):
        self.parts = [MockPart(text)]

class MockEvent:
    def __init__(self, text, is_final=True):
        self._text = text
        self._is_final = is_final
        self.content = MockContent(text)

    def is_final_response(self):
        return self._is_final

@pytest.mark.behavioral
@pytest.mark.asyncio
async def test_google_adk_runner_happy_path():
    """Verify the ADK runner async loop and final response mapping using mocked events."""
    # Create an async generator mock to yield runner events
    async def mock_run_async(*args, **kwargs):
        yield MockEvent("Thinking...", is_final=False)
        yield MockEvent("Calling weather tool...", is_final=False)
        yield MockEvent("The weather in London is sunny and 22C.", is_final=True)

    with patch("google.adk.runners.Runner.run_async", new=mock_run_async):
        response = await run_agent("What is the weather in London?")
        assert "sunny and 22C" in response
        assert "London" in response

@pytest.mark.behavioral
@pytest.mark.asyncio
async def test_google_adk_runner_edge_case():
    """Verify runner outputs proper response for unknown locations using mocked events."""
    async def mock_run_async(*args, **kwargs):
        yield MockEvent("Location not found. Please provide a valid city.", is_final=True)

    with patch("google.adk.runners.Runner.run_async", new=mock_run_async):
        response = await run_agent("What is the weather in Atlantis?")
        assert "not found" in response.lower()
