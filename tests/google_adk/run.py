import asyncio
import sys
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from tests.google_adk.agent import root_agent

async def run_agent(message: str, user_id: str = "dev-user"):
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        state={}, app_name="weather_agent", user_id=user_id
    )
    runner = Runner(
        app_name="weather_agent",
        agent=root_agent,
        session_service=session_service
    )
    content = types.Content(role="user", parts=[types.Part(text=message)])
    
    async for event in runner.run_async(
        user_id=user_id, session_id=session.id, new_message=content
    ):
        if event.is_final_response():
            return event.content.parts[0].text
    return ""

if __name__ == "__main__":
    msg = sys.argv[1] if len(sys.argv) > 1 else "What is the weather in London?"
    print(asyncio.run(run_agent(msg)))
