'''Module to display dynamic quizzes in Jupyter notebooks and Jupyter Books. Uses JavaScript to provide
interactivity across these different formats and to dynamically update questions from a given URL and
randomly select questions from a pool (if desired) when the cell is rerun (Jupyter notebook) or
page is reloaded Jupyter Book (HTML format).

Currently supports two question types: Multiple/Many Choice and Numeric

Created by John M. Shea, copyright 2021
for the book Introduction to Data Science for Engineers

All files in the package are distributed under the MIT License
'''

__version__ = '1.5.2'
from .dynamic import display_quiz
