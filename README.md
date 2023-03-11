# JupyterQuiz
*JupyterQuiz* is a tool for displaying **interactive self-assessment quizes in Jupyter notebooks and Jupyter Book**. 

*JupyterQuiz* is part of my effort to make **open source tools for developing modern, interactive textbooks**.
* The other part of this effort is my interactive self-assessment quiz tool, 
[JupyterCards](https://github.com/jmshea/jupytercards).  
* You can see both tools in action in my 
(in-progress) textbook [Foundations of Data Science with Python](https://jmshea.github.io/Foundations-of-Data-Science-with-Python/).

These animated GIFs illustrate the two basic question types in *JupyterQuiz*:

**Many Choice Question**

![Example many-choice question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/mc-example.gif?raw=true)

 ---
 
 **Numerical Answer Question**
 
![Example numerical answer question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/num-example.gif?raw=true)

---

For more examples with various types of functionality, check out the Review section of Chapter 3 of the *Foundations of Data Science with Python* Jupyter Book: 

[Example of JupyterQuiz in Action](https://jmshea.github.io/Foundations-of-Data-Science-with-Python/03-first-data/review.html)

The notebook [test.ipynb](test.ipynb) shows more features but must be run on your own local Jupyter or in nbviewer -- GitHub only renders the static HTML that does not include the interactive quizzes. (If viewing on GitHub, there should be a little circle with a minus sign at the top of the file that offers you the ability to launch the notebook in nbviewer.)

It currently supports two types of quiz questions:
1. **Multiple/ Many Choice Questions:** Users are given a predefined set of choices and click on answer(s) they believe are correct.
2. **Numerical:** Users are given a text box in which they can submit answers in decimal or fraction form.

Each type of question offers different ways to provide feedback to help users understand what they did wrong (or right).

Quesitons can be loaded from:
* a Python list of dicts,
* a JSON local file,
* via a URL to a JSON file.

**New as of version 1.6 (9/26/2021): You can now embed the question source (most importantly, the answers) in Jupyter Notebook so that they will not be directly visibile to users!**

Question source data can be stored in any Markdown cell in a hidden HTML element (such as a span with the display style set to "none"). Questions can be stored as either JSON or base64-encoded JSON (to make them non-human readable). Please see the notebook [HideQuiz.ipynb](HideQuiz.ipynb) for examples of how to use this.

## Quiz options

JupyterQuiz supports a few options:
* num = Number of questions to present. If this option is chosen, the set of questions will be selected at random.
* shuffle_questions = boolean, whether to shuffle order of questions (default False)
* shuffle_answers = boolean, whether to shuffle answers for multiple-choice questions (default True)
* preserve_responses = boolean, whether to output the user responses in a way that is preserved upon reload of the notebook (default False) -- see below

## Preserving student responses

**New as of version 2.0 (7/26/2022): There is now code to enable preserving student responses (for instance, for checking/grading their quizzes). If you want to use this functionality, please read this carefully!**

To enable this behavior, set `preserve_responses=True` in `display_quiz()`

This option produces a text ouptut that consists of a question number (based on the question order) along with the chosen answer. Instructions are given at the end of the quiz on how to copy the text output and paste it into a pre-prepared Markdown cell. See [preserve-responses.ipynb](preserve-responses.ipynb) for an example.

*The requirement that the student copy and paste the text output to preserve it is because of limitations in the exchange of information from the JavaScript side to the Python side. As far as I know, the only way around this requires a plug-in, and I do not want to require that. I will continue to investigate solutions to this in the future.*

This option is not compatible with `shuffle_questions = True` or setting `num` because these result in the order of the questions being random, which makes no sense when reporting answers vs question number.

## Tool for making Multiple/Many Choice Questions

Dr. WJB Mattingly (@wjbmattingly) has made a [Streamlit App for creating JupyterQuiz question files](https://github.com/wjbmattingly/quiz-generator) in an interactive way without having to edit a JSON file.
It currently supports multiple/many choice questions.


## Installation 

*JupyterQuiz* is available via pip:

``` pip install jupyterquiz```

## Multiple/Many Choice Questions

Multiple/Many Choice questions are defined by a Question, an optional Code block, and a list of possible Answers. Answers include a text component and/or a code block, details on whether the Answer is correct, and Feedback to be displayed for that Answer. The schema for Multiple/Many Choice Questions is shown below:
  ![Schema for Multiple/Many Choice Questions in JupyterQuiz](https://github.com/jmshea/jupyterquiz/blob/main/schema/mc_schema.png?raw=true)

\* = Required parameter, (+) = At least one of these parameters is required



Example JSON for a many-choice question is below:
```
  {
        "question": "Choose all of the following that can be included in Jupyter notebooks?",
        "type": "many_choice",
        "answers": [
            {
                "answer": "Text and graphics output from Python",
                "correct": true,
                "feedback": "Correct."
            },
            {
                "answer": "Typeset mathematics",
                "correct": true,
                "feedback": "Correct."
            },
            {
                "answer": "Python executable code",
                "correct": true,
                "feedback": "Correct."
            },
            {
                "answer": "Formatted text",
                "correct": true,
                "feedback": "Correct."
            },
            {
                "answer": "Live snakes via Python",
                "correct": false,
                "feedback": "I hope not."
            }
        ]
    }
```

## Numerical Questions

Numerical questions consist of a Question, an optional Precision, and one or more Answers. Each Answer can be a Value, a Range, or the Default, and each of these can include Feedback text. Values and Ranges can be marked as correct or incorrect. Ranges are in the form [A,B), where endpoint A is included in the range and endpoint B is not included in the range. When Precision is specified, numerical inputs are rounded to the specified precision before comparing to the Answers. The schema for Numerical questions is shown below:

  ![Schema for Numerical Questions in JupyterQuiz](https://github.com/jmshea/jupyterquiz/blob/main/schema/num_schema.png?raw=true)
  
  \* = Required parameter
  
  Example JSON for a numerical question is below:
```
  {
        "question": "Enter the value of pi (will be checked to 2 decimal places):",
        "type": "numeric",
        "precision": 2,
        "answers": [
            {
                "type": "value",
                "value": 3.14,
                "correct": true,
                "feedback": "Correct."
            },
            {
                "type": "range",
                "range": [ 3.142857, 3.142858], 
                "correct": true,
                "feedback": "True to 2 decimal places, but you know pi is not really 22/7, right?"
            },
            {
                "type": "range",
                "range": [ -100000000, 0], 
                "correct": false,
                "feedback": "pi is the AREA of a circle of radius 1. Try again."
            },
            {
                "type": "default",
                "feedback": "pi is the area of a circle of radius 1. Try again."
            }
        ]
    }
```

## Working with JupyterLite

This should work with JupyterLite as of version 2.1.2. Here is an example that should work on JupyterLite:


```
import micropip
await micropip.install('jupyterquiz')

from jupyterquiz import display_quiz
git_url='https://raw.githubusercontent.com/jmshea/Foundations-of-Data-Science-with-Python/main/questions/'

display_quiz(git_url+'ch1.json')
```


<!-- If you find this useful... 
 <a href="https://www.buymeacoffee.com/jshea" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a> -->
 

