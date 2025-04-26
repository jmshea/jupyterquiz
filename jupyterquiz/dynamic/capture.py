"""
Module for capturing user responses to quizzes.
"""
import string
import random
from IPython.display import display, Javascript, HTML

def capture_responses(prev_div_id):
    """
    Attempt to capture and display responses from a previous quiz container.
    """
    letters = string.ascii_letters
    div_id = ''.join(random.choice(letters) for _ in range(12))

    mydiv = f'<div id="{div_id}"></div>'
    javascript = f"""
{{
  var prev = {prev_div_id};
  var container = document.getElementById("{div_id}");
  var responses = prev.querySelector('.JCResponses');
  if (responses) {{
    var respStr = responses.dataset.responses;
    container.setAttribute('data-responses', respStr);
    var iDiv = document.createElement('div');
    iDiv.id = 'responses' + '{div_id}';
    iDiv.innerText = respStr;
    container.appendChild(iDiv);
  }} else {{
    container.innerText = 'No Responses Found';
  }}
}}
"""
    display(HTML(mydiv))
    display(Javascript(javascript))