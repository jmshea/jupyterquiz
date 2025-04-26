/*
 * Attempt to fetch questions JSON, with timeout and fallback to embedded data.
 */
{
  const controller = new AbortController();
  const signal = controller.signal;
  // Abort fetch after 5 seconds
  setTimeout(() => controller.abort(), 5000);
  fetch("${url}", { signal })
    .then(response => response.json())
    .then(json => show_questions(json, ${div_id}))
    .catch(err => {
      console.log("Fetch error or timeout", err);
      show_questions(questions${div_id}, ${div_id});
    });
}