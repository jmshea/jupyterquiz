"""
Module for loading question data from list, file, URL, or DOM element.
"""
import json
import sys
import urllib.request

# Try to import open_url for Pyodide environments
try:
    from pyodide.http import open_url
except ImportError:
    try:
        from pyodide import open_url
    except ImportError:
        open_url = None

def load_questions_script(ref, div_id):
    """
    Build JavaScript code prefix to load questions into a variable questions{div_id}.
    Returns (script_prefix, static, url), where static is True if questions are embedded,
    and url is the reference URL for async loading when static is False.
    """
    script = ''
    static = True
    url = ''
    # List of question dicts
    if isinstance(ref, list):
        script = f"var questions{div_id}=" + json.dumps(ref)
    # String reference: DOM id, URL, or filename
    elif isinstance(ref, str):
        # DOM element containing JSON or base64-encoded JSON
        if ref.startswith('#'):
            element_id = ref[1:]
            script = (
                f'var element = document.getElementById("{element_id}");\n'
                f'if (element == null) {{ console.log("ID failed, trying class"); '
                f'var elems = document.getElementsByClassName("{element_id}"); '
                f'element = elems[0]; }}\n'
                f'if (element == null) {{ throw new Error("Cannot find element {element_id}"); }}\n'
                f'var questions{div_id};\n'
                f'try {{ questions{div_id} = JSON.parse(window.atob(element.innerHTML)); }} '
                f'catch(err) {{ console.log("Parsing error, using raw innerHTML"); '
                f'questions{div_id} = JSON.parse(element.innerHTML); }}\n'
                f'console.log(questions{div_id});'
            )
        # URL fetched asynchronously, with fallback to embedded content
        elif ref.lower().startswith("http"):
            script = f"var questions{div_id}="
            url = ref
            # Embed initial data for fallback
            if sys.platform == 'emscripten' and open_url:
                text = open_url(url).read()
                script += text
            else:
                with urllib.request.urlopen(url) as response:
                    for line in response:
                        script += line.decode('utf-8')
            static = False
        # Local file path
        else:
            script = f"var questions{div_id}="
            with open(ref, 'r') as f:
                for line in f:
                    script += line
            static = True
    else:
        raise Exception("First argument must be list, URL, or file ref")
    # Terminate statement
    script += ";\n\nif (typeof Question === 'undefined') {\n"
    return script, static, url
