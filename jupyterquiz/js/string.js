function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j - 1][i] + 1, // Deletion
                matrix[j][i - 1] + 1, // Insertion
                matrix[j - 1][i - 1] + cost // Substitution
            );
        }
    }
    return matrix[b.length][a.length];
}
// Object-oriented wrapper for string input questions
class StringQuestion extends Question {
    constructor(qa, id, idx, opts, rootDiv) {
        super(qa, id, idx, opts, rootDiv);
    }
    render() {
        make_string(this.qa, this.outerqDiv, this.qDiv, this.aDiv, this.id);
        this.wrapper.appendChild(this.fbDiv);
    }
}
Question.register('string', StringQuestion);

function check_string(ths, event) {
    if (event.keyCode === 13) {
        ths.blur();

        var id = ths.id.split('-')[0];
        var submission = ths.value.trim();
        var fb = document.getElementById("fb" + id);
        fb.style.display = "none";
        fb.innerHTML = "Incorrect -- try again.";

        var answers = JSON.parse(ths.dataset.answers);
        var defaultFB = "Incorrect. Try again.";
        var correct;
        var done = false;

        answers.every(answer => {
            correct = false;

            let match = false;
            if (answer.match_case) {
                match = submission === answer.answer;
            } else {
                match = submission.toLowerCase() === answer.answer.toLowerCase();
            }
            console.log(submission);
            console.log(answer.answer);
            console.log(match);

            if (match) {
                if ("feedback" in answer) {
                    fb.innerHTML = jaxify(answer.feedback);
                } else {
                    fb.innerHTML = jaxify("Correct");
                }
                correct = answer.correct;
                done = true;
            } else if (answer.fuzzy_threshold) {
                var max_length = Math.max(submission.length, answer.answer.length);
                var ratio;
                if (answer.match_case) {
                    ratio = 1- (levenshteinDistance(submission, answer.answer) / max_length);
                } else {
                    ratio = 1- (levenshteinDistance(submission.toLowerCase(),
                                                    answer.answer.toLowerCase()) / max_length);
                }
                if (ratio >= answer.fuzzy_threshold) {
                    if ("feedback" in answer) {
                        fb.innerHTML = jaxify("(Fuzzy) " + answer.feedback);
                    } else {
                        fb.innerHTML = jaxify("Correct");
                    }
                    correct = answer.correct;
                    done = true;
                }

            }

            if (done) {
                return false;
            } else {
                return true;
            }
        });

        if ((!done) && (defaultFB != "")) {
            fb.innerHTML = jaxify(defaultFB);
        }

        fb.style.display = "block";
        if (correct) {
            ths.className = "Input-text";
            ths.classList.add("correctButton");
            fb.className = "Feedback";
            fb.classList.add("correct");
        } else {
            ths.className = "Input-text";
            ths.classList.add("incorrectButton");
            fb.className = "Feedback";
            fb.classList.add("incorrect");
        }

        var outerContainer = fb.parentElement.parentElement;
        var responsesContainer = document.getElementById("responses" + outerContainer.id);
        if (responsesContainer) {
            var qnum = document.getElementById("quizWrap" + id).dataset.qnum;
            var responses = JSON.parse(responsesContainer.dataset.responses);
            responses[qnum] = submission;
            responsesContainer.setAttribute('data-responses', JSON.stringify(responses));
            printResponses(responsesContainer);
        }

        if (typeof MathJax != 'undefined') {
            var version = MathJax.version;
            if (version[0] == "2") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            } else if (version[0] == "3") {
                MathJax.typeset([fb]);
            }
        } else {
            console.log('MathJax not detected');
        }
        return false;
    }
}

function string_keypress(evnt) {
    var charC = (evnt.which) ? evnt.which : evnt.keyCode;

    if (charC == 13) {
        check_string(this, evnt);
    } 
}


function make_string(qa, outerqDiv, qDiv, aDiv, id) {
    outerqDiv.className = "StringQn";
    aDiv.style.display = 'block';

    var lab = document.createElement("label");
    lab.className = "InpLabel";
    lab.innerHTML = "Type your answer here:";
    aDiv.append(lab);

    var inp = document.createElement("input");
    inp.type = "text";
    inp.id = id + "-0";
    inp.className = "Input-text";
    inp.setAttribute('data-answers', JSON.stringify(qa.answers));
    aDiv.append(inp);

    inp.onkeypress = string_keypress;
    inp.onpaste = event => false;

    inp.addEventListener("focus", function (event) {
        this.value = "";
        return false;
    });
}
