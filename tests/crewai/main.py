import sys
from tests.crewai.crew import SimpleCrew

def run():
    inputs = {
        "topic": sys.argv[1] if len(sys.argv) > 1 else "AI Agents in 2026"
    }
    result = SimpleCrew().crew().kickoff(inputs=inputs)
    print(result)

if __name__ == "__main__":
    run()
