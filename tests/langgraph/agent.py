import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from tests.langgraph.tools import multiply_numbers

load_dotenv()

SYSTEM_PROMPT = "You are a helpful assistant. Always use the multiply_numbers tool to calculate products."
api_key = os.getenv("OPENAI_API_KEY", "mock-key")
model = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
graph = create_react_agent(
    model=model,
    tools=[multiply_numbers],
    prompt=SYSTEM_PROMPT,
    checkpointer=MemorySaver()
)
