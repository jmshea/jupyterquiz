"""
Entry point for displaying quizzes in Jupyter environments.
"""
import string
import random
from IPython.display import display, Javascript, HTML

from .loader import load_questions_script
from .renderer import render_div, build_styles, build_script

def display_quiz(ref, num=1_000_000, shuffle_questions=False,
                 shuffle_answers=True, preserve_responses=False,
                 border_radius=10, question_alignment="left",
                 max_width=600, colors=None, load_js=True):
    """
    Display an interactive quiz in a Jupyter notebook.

    Parameters are the same as documented in the original dynamic.py.
    """
    assert not (shuffle_questions and preserve_responses), \
        "Preserving responses not supported when shuffling questions."
    assert num == 1_000_000 or (not preserve_responses), \
        "Preserving responses not supported when num is set."
    assert question_alignment in ['left', 'right', 'center'], \
        "question_alignment must be 'left', 'center', or 'right'"

    # Unique identifier for container
    letters = string.ascii_letters
    div_id = ''.join(random.choice(letters) for _ in range(12))

    preserve_json = 'true' if preserve_responses else 'false'

    # Default color palette
    color_dict = {
        '--jq-multiple-choice-bg': '#6f78ffff',
        '--jq-mc-button-bg': '#fafafa',
        '--jq-mc-button-border': '#e0e0e0e0',
        '--jq-mc-button-inset-shadow': '#555555',
        '--jq-many-choice-bg': '#f75c03ff',
        '--jq-numeric-bg': '#392061ff',
        '--jq-numeric-input-bg': '#c0c0c0',
        '--jq-numeric-input-label': '#101010',
        '--jq-numeric-input-shadow': '#999999',
        '--jq-incorrect-color': '#c80202',
        '--jq-correct-color': '#009113',
        '--jq-text-color': '#fafafa'
    }
    # Alternative palette
    fdsp_dict = {
        '--jq-multiple-choice-bg': '#345995',
        '--jq-mc-button-bg': '#fafafa',
        '--jq-mc-button-border': '#e0e0e0e0',
        '--jq-mc-button-inset-shadow': '#555555',
        '--jq-many-choice-bg': '#e26d5a',
        '--jq-numeric-bg': '#5bc0eb',
        '--jq-numeric-input-bg': '#c0c0c0',
        '--jq-numeric-input-label': '#101010',
        '--jq-numeric-input-shadow': '#999999',
        '--jq-incorrect-color': '#666666',
        '--jq-correct-color': '#87a878',
        '--jq-text-color': '#fafafa'
    }
    if colors == 'fdsp':
        color_dict = fdsp_dict
    elif isinstance(colors, dict):
        color_dict.update(colors)

    # Build loading script
    prefix_script, static, url = load_questions_script(ref, div_id)

    # Render HTML container and styles
    mydiv = render_div(div_id, shuffle_questions, shuffle_answers,
                       preserve_responses, num,
                       max_width, border_radius, question_alignment)
    styles = build_styles(div_id, color_dict)

    # Combine all JavaScript
    javascript = build_script(prefix_script, static, url, div_id, load_js)

    # Display in notebook
    display(HTML(mydiv + styles))
    display(Javascript(javascript))
