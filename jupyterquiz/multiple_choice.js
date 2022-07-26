function check_mc() {
    var id = this.id.split('-')[0];
    //var response = this.id.split('-')[1];
    //console.log(response);
    //console.log("In check_mc(), id="+id);
    //console.log(event.srcElement.id)           
    //console.log(event.srcElement.dataset.correct)   
    //console.log(event.srcElement.dataset.feedback)

    var label = event.srcElement;
    //console.log(label, label.nodeName);
    var depth = 0;
    while ((label.nodeName != "LABEL") && (depth < 20)) {
        label = label.parentElement;
        console.log(depth, label);
        depth++;
    }



    var answers = label.parentElement.children;

    //console.log(answers);


    // Split behavior based on multiple choice vs many choice:
    var fb = document.getElementById("fb" + id);




    if (fb.dataset.numcorrect == 1) {
        // What follows is for the saved responses stuff
        var outerContainer = fb.parentElement.parentElement;
        var responsesContainer = document.getElementById("responses" + outerContainer.id);
        if (responsesContainer) {
            //console.log(responsesContainer);
            var response = label.firstChild.innerText;
            if (label.querySelector(".QuizCode")){
                response+= label.querySelector(".QuizCode").firstChild.innerText;
            }
            console.log(response);
            //console.log(document.getElementById("quizWrap"+id));
            var qnum = document.getElementById("quizWrap"+id).dataset.qnum;
            console.log("Question " + qnum);
            //console.log(id, ", got numcorrect=",fb.dataset.numcorrect);
            var responses=JSON.parse(responsesContainer.dataset.responses);
            console.log(responses);
            responses[qnum]= response;
            responsesContainer.setAttribute('data-responses', JSON.stringify(responses));
            printResponses(responsesContainer);
        }
        // End code to preserve responses
        
        for (var i = 0; i < answers.length; i++) {
            var child = answers[i];
            //console.log(child);
            child.className = "MCButton";
        }



        if (label.dataset.correct == "true") {
            // console.log("Correct action");
            if ("feedback" in label.dataset) {
                fb.textContent = jaxify(label.dataset.feedback);
            } else {
                fb.textContent = "Correct!";
            }
            label.classList.add("correctButton");

            fb.className = "Feedback";
            fb.classList.add("correct");

        } else {
            if ("feedback" in label.dataset) {
                fb.textContent = jaxify(label.dataset.feedback);
            } else {
                fb.textContent = "Incorrect -- try again.";
            }
            //console.log("Error action");
            label.classList.add("incorrectButton");
            fb.className = "Feedback";
            fb.classList.add("incorrect");
        }
    }
    else {
        var reset = false;
        var feedback;
         if (label.dataset.correct == "true") {
            if ("feedback" in label.dataset) {
                feedback = jaxify(label.dataset.feedback);
            } else {
                feedback = "Correct!";
            }
            if (label.dataset.answered <= 0) {
                if (fb.dataset.answeredcorrect < 0) {
                    fb.dataset.answeredcorrect = 1;
                    reset = true;
                } else {
                    fb.dataset.answeredcorrect++;
                }
                if (reset) {
                    for (var i = 0; i < answers.length; i++) {
                        var child = answers[i];
                        child.className = "MCButton";
                        child.dataset.answered = 0;
                    }
                }
                label.classList.add("correctButton");
                label.dataset.answered = 1;
                fb.className = "Feedback";
                fb.classList.add("correct");

            }
        } else {
            if ("feedback" in label.dataset) {
                feedback = jaxify(label.dataset.feedback);
            } else {
                feedback = "Incorrect -- try again.";
            }
            if (fb.dataset.answeredcorrect > 0) {
                fb.dataset.answeredcorrect = -1;
                reset = true;
            } else {
                fb.dataset.answeredcorrect--;
            }

            if (reset) {
                for (var i = 0; i < answers.length; i++) {
                    var child = answers[i];
                    child.className = "MCButton";
                    child.dataset.answered = 0;
                }
            }
            label.classList.add("incorrectButton");
            fb.className = "Feedback";
            fb.classList.add("incorrect");
        }
        // What follows is for the saved responses stuff
        var outerContainer = fb.parentElement.parentElement;
        var responsesContainer = document.getElementById("responses" + outerContainer.id);
        if (responsesContainer) {
            //console.log(responsesContainer);
            var response = label.firstChild.innerText;
            if (label.querySelector(".QuizCode")){
                response+= label.querySelector(".QuizCode").firstChild.innerText;
            }
            console.log(response);
            //console.log(document.getElementById("quizWrap"+id));
            var qnum = document.getElementById("quizWrap"+id).dataset.qnum;
            console.log("Question " + qnum);
            //console.log(id, ", got numcorrect=",fb.dataset.numcorrect);
            var responses=JSON.parse(responsesContainer.dataset.responses);
            if (label.dataset.correct == "true") {
                if (typeof(responses[qnum]) == "object"){
                    if (!responses[qnum].includes(response))
                        responses[qnum].push(response);
                } else{
                    responses[qnum]= [ response ];
                }
            } else {
                responses[qnum]= response;
            }
            console.log(responses);
            responsesContainer.setAttribute('data-responses', JSON.stringify(responses));
            printResponses(responsesContainer);
        }
        // End save responses stuff



        var numcorrect = fb.dataset.numcorrect;
        var answeredcorrect = fb.dataset.answeredcorrect;
        if (answeredcorrect >= 0) {
            fb.textContent = feedback + " [" + answeredcorrect + "/" + numcorrect + "]";
        } else {
            fb.textContent = feedback + " [" + 0 + "/" + numcorrect + "]";
        }


    }

    if (typeof MathJax != 'undefined') {
        var version = MathJax.version;
        console.log('MathJax version', version);
        if (version[0] == "2") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        } else if (version[0] == "3") {
            MathJax.typeset([fb]);
        }
    } else {
        console.log('MathJax not detected');
    }

}

function make_mc(qa, shuffle_answers, outerqDiv, qDiv, aDiv, id) {
    var shuffled;
    if (shuffle_answers == "True") {
        //console.log(shuffle_answers+" read as true");
        shuffled = getRandomSubarray(qa.answers, qa.answers.length);
    } else {
        //console.log(shuffle_answers+" read as false");
        shuffled = qa.answers;
    }


    var num_correct = 0;



    shuffled.forEach((item, index, ans_array) => {
        //console.log(answer);

        // Make input element
        var inp = document.createElement("input");
        inp.type = "radio";
        inp.id = "quizo" + id + index;
        inp.style = "display:none;";
        aDiv.append(inp);

        //Make label for input element
        var lab = document.createElement("label");
        lab.className = "MCButton";
        lab.id = id + '-' + index;
        lab.onclick = check_mc;
        var aSpan = document.createElement('span');
        aSpan.classsName = "";
        //qDiv.id="quizQn"+id+index;
        if ("answer" in item) {
            aSpan.innerHTML = jaxify(item.answer);
            //aSpan.innerHTML=item.answer;
        }
        lab.append(aSpan);

        // Create div for code inside question
        var codeSpan;
        if ("code" in item) {
            codeSpan = document.createElement('span');
            codeSpan.id = "code" + id + index;
            codeSpan.className = "QuizCode";
            var codePre = document.createElement('pre');
            codeSpan.append(codePre);
            var codeCode = document.createElement('code');
            codePre.append(codeCode);
            codeCode.innerHTML = item.code;
            lab.append(codeSpan);
            //console.log(codeSpan);
        }

        //lab.textContent=item.answer;

        // Set the data attributes for the answer
        lab.setAttribute('data-correct', item.correct);
        if (item.correct) {
            num_correct++;
        }
        if ("feedback" in item) {
            lab.setAttribute('data-feedback', item.feedback);
        }
        lab.setAttribute('data-answered', 0);

        aDiv.append(lab);

    });

    if (num_correct > 1) {
        outerqDiv.className = "ManyChoiceQn";
    } else {
        outerqDiv.className = "MultipleChoiceQn";
    }

    return num_correct;

}
