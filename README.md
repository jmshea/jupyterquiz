# JupyterQuiz
*JupyterQuiz* is a tool for displaying **interactive self-assessment quizzes in Jupyter notebooks and Jupyter Book**. JupyterQuiz was created to enable interactive quizzes for readers of my book [*Foundations of Data Science with Python*](https://t.co/ES9zBUMSQF) [Affiliate Link]

**Important Note for JupyterLab 4 Users:** Changes to the math rendering system in JupyterLab 4 have broken the LaTeX rendering in JupyterQuiz. There is not currently a simple solution, but I have opened an issue requesting that the necessary methods be made available. Math should still work in Jupyter Book. A very hacky solution is available in version 2.7.0a4, which loads MathJax 3 on top of the JupyterLab MathJax version. Use at your own risk! (It can be installed as `pip install jupyterquiz==2.7.0a4`. Note that 2.7.0a3 also changed how the precision parameter effects numerical answers. Prior to 2.7.0a3, precision specified a decimal place; from 2.7.0a3 on, it specifies a number of significant digits. )

*JupyterQuiz* is part of my effort to make **open source tools for developing modern, interactive textbooks**.
* The other part of this effort is my interactive flashcards tool, 
[JupyterCards](https://github.com/jmshea/jupytercards).  
* You can see both tools in action in my 
(in-progress) textbook [Foundations of Data Science with Python](https://jmshea.github.io/Foundations-of-Data-Science-with-Python/).

If you would like to see a video that introduces these tools and discusses *why* I made them, check out my [JupyterCon 2023 talk on Tools for Interactive Education Experiences in Jupyter Notebooks and Jupyter Books](https://www.youtube.com/watch?v=MDMUiQ2_ZWE).

These animated GIFs illustrate the two basic question types in *JupyterQuiz*:

**Many Choice Question**

![Example many-choice question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/mc-example.gif?raw=true)

 ---
 
 **Numerical Answer Question**
 
![Example numerical answer question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/num-example.gif?raw=true)

---

**Examples using JupyterQuiz**

This library was built to create interactive questions for the  [*Foundations of Data Science with Python*](https://www.amazon.com/Foundations-Data-Science-Python-Chapman/dp/1032350423) book by John M. Shea. Example: [Chapter 3 Self-Assessment Questions](https://www.fdsp.net/03-first-data/summary.html#terminology-review)

Some other examples I have seen around the web include:
* *Introduction to Python for Humanists* book by W.J.B. Mattingly. Example: [Section 2.2 Introduction to Data Structures, ](https://python-textbook.pythonhumanities.com/01_intro/01_02-03_data_structures.html)
* *Groundwater I* by  P. K. Yadav, T. Reimann, and others. Example: [Lecture 1: Course Introduction/Water Cycle of ](https://vibhubatheja.github.io/GW-Book/content/background/03_basic_hydrogeology.html)
* *Sizing and optimization of mechatronic systems* course by Marc Budinger, Scott Delbecq and Félix Pollet. Example: [Lecture 1 Quiz](https://sizinglab.github.io/sizing_course/class/Lecture1/4-quizz.html)
* *Linux en Bioinformatique* by Thomas Denecker & Claire Toffano-Nioche. Example: [Quizz 1](https://ifb-elixirfr.github.io/LinuxEBAII/quizz_01.html) 
* *Programmering i Kjemi (Programming in Chemistry?)* by Andreas Haraldsrud. Example: [Quiz 1: Variabler og aritmetikk](https://andreasdh.github.io/programmering-i-kjemi/docs/grunnleggende_programmering/quiz1.html)
* *AnIML: Another Introduction to Machine Learning* by Hunter Schafer. Example: [Chapter 2: Assessing Performance](https://animlbook.com/regression/assessing_performance/index.html)

If you using JupyterQuiz in a Jupyter Book or other way that is useable on the web, please clone this repository, add your information to the bulleted list in the README.md, and make a pull request for me to include a link to your use of this library.

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

### Quiz Formatting
In addtion, it supports additional options for controlling the formatting of the quiz options.

* `border_radius` = boolean, border radius of question boxes
* `question_alignment` = string, alignment of question text (e.g., "left", "right)
* `max_width` = int, max width of question boxes

For more fine-grained formatting control of the question text, leaving the
question field the empty string (`""`) will result in only the answers being
displayed. This allows for custom question formatting such as including images,
tables, more complex code examples, etc. Note that this feature works better for
a single question quiz and may not work as well with shuffled quizzes or quiz
questions selected at random.

Colors can be changed by passing the `colors` keyword argument. Pass in a dictionary of colors that you would like to change. Here is the default dictionary for reference:

```{Python}
color_dict = {
        '--jq-multiple-choice-bg': '#6f78ffff',   # Background for the question part of multiple-choice questions
        '--jq-mc-button-bg': '#fafafa',           # Background for the buttons when not pressed
        '--jq-mc-button-border': '#e0e0e0e0',     # Border of the buttons
        '--jq-mc-button-inset-shadow': '#555555', # Color of inset shadow for pressed buttons
        '--jq-many-choice-bg': '#f75c03ff',       # Background for question part of many-choice questions
        '--jq-numeric-bg': '#392061ff',           # Background for question part of numeric questions
        '--jq-numeric-input-bg': '#c0c0c0',       # Background for input area of numeric questions
        '--jq-numeric-input-label': '#101010',    # Color for input of numeric questions
        '--jq-numeric-input-shadow': '#999999',   # Color for shadow of input area of numeric questions when selected
        '--jq-incorrect-color': '#c80202',        # Color for incorrect answers 
        '--jq-correct-color': '#009113',          # Color for correct answers
        '--jq-text-color': '#fafafa'              # Color for question text
    }
```

There is one included alternative set of colors to the default colors, which be selected by passing `colors='fdsp'`.

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


**As an Amazon Associate I earn from qualifying purchases.**


