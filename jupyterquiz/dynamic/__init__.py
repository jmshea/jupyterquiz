"""
dynamic subpackage splitting responsibilities of dynamic.py.
"""
from .display import display_quiz
from .capture import capture_responses

__all__ = ["display_quiz", "capture_responses"]