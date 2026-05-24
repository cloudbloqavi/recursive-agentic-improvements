from google.adk.agents import LlmAgent

def fetch_weather(location: str) -> dict:
    """Get the current weather for a specific location.

    Args:
        location: The city and state/country (e.g. San Francisco, CA)
    Returns:
        A dictionary containing weather summary
    """
    return {"weather": f"sunny and 22C in {location}"}

root_agent = LlmAgent(
    name="weather_agent",
    model="gemini-2.5-flash",
    instruction="You are a helpful weather assistant. Always use fetch_weather to retrieve weather details.",
    tools=[fetch_weather],
)
