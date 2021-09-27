from IPython.core.display import display, Javascript, HTML
import string
import random
import pkg_resources
import urllib
import json


def display_quiz(ref, num=1_000_000, shuffle_questions=False, shuffle_answers=True):
    '''
    Display an interactive quiz (currently multiple-choice or numeric answer)
    using a mix of Python and Javascript to support use in rendered notebooks
    (especially JupyterBook, but also Voila)

    Inputs:
    ref = string, reference to quiz JSON, may be:
          - file name
          - URL
          - Python dict
          - ID of HTML element with JSON as inner HTML
          - ID of HTML element with base64-encoded JSON as inner HTML

    shuffle_questions = boolean, whether to shuffle order of questions (default False)

    shuffle_answers = boolean, whether to shuffle answers for multiple-choice questions (default True)

    John  M. Shea
    9/26/2021
    '''
    resource_package = __name__

    letters = string.ascii_letters
    div_id = ''.join(random.choice(letters) for i in range(12))
    #print(div_id)

    mydiv = f"""<div id="{div_id}" data-shufflequestions="{str(shuffle_questions)}"
               data-shuffleanswers="{str(shuffle_answers)}"
               data-numquestions="{str(num)}"> """
    #print(mydiv)

    styles = "<style>"
    css = pkg_resources.resource_string(resource_package, "styles.css")
    styles += css.decode("utf-8")
    styles += "</style>"

    script = '<script type="text/Javascript">'


    if type(ref) == list:
        #print("List detected. Assuming JSON")
        script += f"var questions{div_id}="
        script += json.dumps(ref)
        static = True
        url = ""
    elif type(ref) == str:
        if ref[0] == '#':
            script+=f'''var element=document.getElementById("{ref[1:]}");
            var questions;
            try {{
               questions{div_id}=eval(window.atob(element.innerHTML));
            }} catch(err) {{
               console.log("Fell into catch");
               questions{div_id} = eval(element.innerHTML);
            }}
            console.log(questions{div_id});'''
            static = True;
            #print(script)
        elif ref.lower().find("http") == 0:
            script += f"var questions{div_id}="
            url = ref
            file = urllib.request.urlopen(url)
            for line in file:
                script += line.decode("utf-8")
            static = False
        else:
            #print("File detected")
            script += f"var questions{div_id}="
            with open(ref) as file:
                for line in file:
                    script += line
            static = True
            url = ""
    else:
        raise Exception("First argument must be list (JSON), URL, or file ref")

    script += ''';
    '''


    #display(HTML(mydiv + script))
    # return

    # print(__name__)
    helpers = pkg_resources.resource_string(resource_package, "helpers.js")
    script += helpers.decode("utf-8")

    multiple_choice = pkg_resources.resource_string(
        resource_package, "multiple_choice.js")
    script += multiple_choice.decode("utf-8")

    numeric = pkg_resources.resource_string(resource_package, "numeric.js")
    script += numeric.decode("utf-8")

    show_questions = pkg_resources.resource_string(
        resource_package, "show_questions.js")
    script += show_questions.decode("utf-8")

    if static:
        script += f"""
        {{
        show_questions(questions{div_id},  {div_id});
        }}
        </script>
        """
        javascript = script 


        print()
    else:
        script += f'''
        //console.log(element);
        {{
        const jmscontroller = new AbortController();
        const signal = jmscontroller.signal;

        setTimeout(() => jmscontroller.abort(), 5000);

        fetch("{url}", {{signal}})
        .then(response => response.json())
        .then(json => show_questions(json, {div_id}))
        .catch(err => {{
        console.log("Fetch error or timeout");
        show_questions(questions{div_id}, {div_id});
        }});
        }}
        </script>
        '''
        javascript = script 

    # print(javascript)
    display(HTML(mydiv + styles + javascript))
