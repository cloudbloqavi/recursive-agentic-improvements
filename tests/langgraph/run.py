import sys
from tests.langgraph.agent import graph

def run():
    msg = sys.argv[1] if len(sys.argv) > 1 else "What is 12 multiplied by 9?"
    config = {"configurable": {"thread_id": "test-thread"}}
    for event in graph.stream({"messages": [("user", msg)]}, config):
        for value in event.values():
            if "messages" in value:
                print("Assistant:", value["messages"][-1].content)

if __name__ == "__main__":
    run()
