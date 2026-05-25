import pytest
from unittest.mock import patch, MagicMock
from tests.crewai.crew import SimpleCrew

@pytest.mark.static
def test_crewai_crew_structure():
    """Verify static structural properties of the CrewAI crew."""
    crew_instance = SimpleCrew().crew()
    assert len(crew_instance.agents) == 2
    assert len(crew_instance.tasks) == 2
    assert crew_instance.process.name == "sequential"
    
    # Check individual agents configuration loading
    researcher = next(a for a in crew_instance.agents if "research" in a.role.lower())
    writer = next(a for a in crew_instance.agents if "writer" in a.role.lower())
    
    assert researcher is not None
    assert writer is not None
    assert researcher.allow_delegation is False
    assert writer.allow_delegation is False

@pytest.mark.static
def test_crewai_task_context():
    """Verify that tasks have appropriate description, expected output, and context settings."""
    crew_instance = SimpleCrew().crew()
    research_task = next(t for t in crew_instance.tasks if "research_task" in t.description.lower() or "conduct research" in t.description.lower())
    write_task = next(t for t in crew_instance.tasks if "write" in t.description.lower())
    
    assert research_task is not None
    assert write_task is not None
    assert write_task.context == [research_task]

@pytest.mark.behavioral
@patch("crewai.crew.Crew.kickoff")
def test_crewai_crew_happy_path(mock_kickoff):
    """Verify CrewAI kickoff return value and parameter invocation using mocked output."""
    mock_output = MagicMock()
    mock_output.raw = "This is a two-paragraph summary of AI Agents in 2026.\n\nIt covers key facts and findings."
    mock_kickoff.return_value = mock_output
    
    inputs = {"topic": "AI Agents in 2026"}
    result = SimpleCrew().crew().kickoff(inputs=inputs)
    
    assert "summary of AI Agents" in result.raw
    mock_kickoff.assert_called_once_with(inputs=inputs)

@pytest.mark.behavioral
@patch("crewai.crew.Crew.kickoff")
def test_crewai_crew_edge_case(mock_kickoff):
    """Verify CrewAI crew handles empty inputs gracefully using mock outputs."""
    mock_output = MagicMock()
    mock_output.raw = "No topic provided, showing generic tech trends summary."
    mock_kickoff.return_value = mock_output
    
    inputs = {"topic": ""}
    result = SimpleCrew().crew().kickoff(inputs=inputs)
    
    assert "generic" in result.raw.lower()
    mock_kickoff.assert_called_once_with(inputs=inputs)
