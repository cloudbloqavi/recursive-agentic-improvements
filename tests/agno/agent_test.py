import sys
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.db.sqlite import SqliteDb

# A simple custom tool for adding numbers
def add_numbers(a: int, b: int) -> int:
    """Add two numbers together. Use this tool when you need to calculate sums.

    Args:
        a: First number
        b: Second number
    Returns:
        The sum of the two numbers
    """
    return a + b

db = SqliteDb(
    session_table="calc_sessions",
    db_file="tmp/calc_agent.db"
)

agent = Agent(
    name="calculator-agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    description="You are a simple calculator assistant.",
    instructions=[
        "You help users with arithmetic.",
        "Always use the add_numbers tool when asked to add numbers.",
        "Never make up calculation results without calling a tool."
    ],
    tools=[add_numbers],
    db=db,
    add_history_to_context=True,
    markdown=True
)

if __name__ == "__main__":
    msg = sys.argv[1] if len(sys.argv) > 1 else "How much is 15 + 27?"
    agent.print_response(msg, stream=True)
