/*
 * Handle asynchrony issues when re-running quizzes in Jupyter notebooks.
 * Ensures show_questions is called after the container div is in the DOM.
 */
function try_show() {
  if (document.getElementById("${div_id}")) {
    show_questions(questions${div_id}, ${div_id});
  } else {
    setTimeout(try_show, 200);
  }
};
// Invoke immediately
{
  try_show();
}