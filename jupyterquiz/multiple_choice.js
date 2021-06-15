function check_mc() {
    var id=this.id.split('-')[0];

    //console.log("In check_mc(), id="+id);
    //console.log(event.srcElement.id)           
    //console.log(event.srcElement.dataset.correct)   
    //console.log(event.srcElement.dataset.feedback)

    var answers= event.srcElement.parentElement.children;
    //console.log(answers);
    
    // Split behavior based on multiple choice vs many choice:
    var fb = document.getElementById("fb"+id);
    if (fb.dataset.numcorrect==1) {
        for (var i = 0; i < answers.length; i++) {
            var child=answers[i];
            child.className="MCButton";
        }



        fb.textContent=event.srcElement.dataset.feedback;
        if (event.srcElement.dataset.correct=="true")   {
            // console.log("Correct action");
            this.classList.add("correctButton");

            fb.className="Feedback";
            fb.classList.add("correct");

        } else {
            //console.log("Error action");
            this.classList.add("incorrectButton");
            fb.className="Feedback";
            fb.classList.add("incorrect");
        }
    }
    else {
        //console.log("Many choice not implemented yet");
        var reset = false;
        if (event.srcElement.dataset.correct=="true" )   {
            if (event.srcElement.dataset.answered<=0) {
                if (fb.dataset.answeredcorrect<0) {
                    fb.dataset.answeredcorrect=1;
                    reset=true;
                } else {
                    fb.dataset.answeredcorrect++;
                }
                if (reset) {
                    for (var i = 0; i < answers.length; i++) {
                        var child=answers[i];
                        child.className="MCButton";
                        child.dataset.answered=0;
                    }
                }
                this.classList.add("correctButton");
                this.dataset.answered=1;
                fb.className="Feedback";
                fb.classList.add("correct");

            }
        } else {
            if (fb.dataset.answeredcorrect>0) {
                fb.dataset.answeredcorrect=-1;
                reset=true;
            } else {
                fb.dataset.answeredcorrect--;
            }

            if (reset) {
                for (var i = 0; i < answers.length; i++) {
                    var child=answers[i];
                    child.className="MCButton";
                    child.dataset.answered=0;
                }
            }
            this.classList.add("incorrectButton");
            fb.className="Feedback";
            fb.classList.add("incorrect");
        }


        var numcorrect=fb.dataset.numcorrect;
        var answeredcorrect=fb.dataset.answeredcorrect;
        if (answeredcorrect>=0) {
            fb.textContent=event.srcElement.dataset.feedback + " ["  + answeredcorrect + "/" + numcorrect + "]";
        } else {
            fb.textContent=event.srcElement.dataset.feedback + "["  + 0 + "/" + numcorrect + "]";
        }


    }

    

}

function make_mc(qa, shuffle_answers, outerqDiv, qDiv, aDiv, id) {
    var shuffled;
    if (shuffle_answers=="True") {
        //console.log(shuffle_answers+" read as true");
        shuffled=getRandomSubarray(qa.answers, qa.answers.length);
    } else {
        //console.log(shuffle_answers+" read as false");
        shuffled=qa.answers;
    }
    

    var num_correct=0;


    
    shuffled.forEach((item, index, ans_array) => {
        //console.log(answer);
        
        // Make input element
        var inp = document.createElement("input");
        inp.type="radio";
        inp.id="quizo"+id+index;
        inp.style="display:none;";
        aDiv.append(inp);
        
        //Make label for input element
        var lab = document.createElement("label");
        lab.className="MCButton";
        lab.id=id+ '-' +index;
        lab.onclick=check_mc;
        lab.textContent=item.answer;
        
        // Set the data attributes for the answer
        lab.setAttribute('data-correct', item.correct);
        if (item.correct) {
            num_correct++;
        }
        lab.setAttribute('data-feedback', item.feedback);
        lab.setAttribute('data-answered', 0);

        aDiv.append(lab);

    });

    if (num_correct>1) {
        outerqDiv.className="ManyChoiceQn";
    } else {
        outerqDiv.className="MultipleChoiceQn";
    }

    return num_correct;

}
