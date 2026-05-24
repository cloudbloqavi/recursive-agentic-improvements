import pytest
from tests.crewai.crew import SimpleCrew

def test_crewai_crew():
    crew_instance = SimpleCrew().crew()
    assert len(crew_instance.agents) == 2
    assert len(crew_instance.tasks) == 2
