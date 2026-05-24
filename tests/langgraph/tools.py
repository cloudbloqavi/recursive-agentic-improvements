from langchain_core.tools import tool

@tool
def multiply_numbers(a: int, b: int) -> int:
    """Multiply two integers together. Use this when asked to multiply.

    Args:
        a: First number
        b: Second number
    Returns:
        The product of the two numbers
    """
    return a * b
