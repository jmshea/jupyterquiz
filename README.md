# JupyterQuiz
JupyterQuiz is a tool for displaying **interactive self-assessment quizes in Jupyter notebooks and Jupyter Book**. These animated GIFs illustrate the two basic question types:

**Many Choice Question**

![Example many-choice question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/mc-example.gif?raw=true)

 ---
 
 **Numerical Answer Question**
 
![Example numerical answer question using JupyterQuiz.](https://github.com/jmshea/jupyterquiz/blob/main/examples/num-example.gif?raw=true)

---

For more examples with various types of functionality, check out the Review section of Chapter 3 of the *Introduction to Data Science for Engineers* Jupyter Book: 

[Example of JupyterQuiz in Action](https://jmshea.github.io/intro-data-science-for-engineers/03-first-data/review.html)

The notebook [test.ipynb](test.ipynb) shows more features but must be run on your own local Jupyter or in nbviewer -- GitHub only renders the static HTML that does not include the interactive quizzes. (If viewing on GitHub, there should be a little circle with a minus sign at the top of the file that offers you the ability to launch the notebook in nbviewer.)

It currently supports two types of quiz questions:
1. **Multiple/ Many Choice Questions:** Users are given a predefined set of choices and click on answer(s) they believe are correct.
2. **Numerical:** Users are given a text box in which they can submit answers in decimal or fraction form.

Each type of question offers different ways to provide feedback to help users understand what they did wrong (or right). Questions can be written as JSON or loaded from a dictionary in Python. 

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

If you find this useful... 
 <a href="https://www.buymeacoffee.com/jshea" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
 

