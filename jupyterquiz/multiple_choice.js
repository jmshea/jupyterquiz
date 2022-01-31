// This version of multiple_chocie.js does not show the truth answer while saving a record of each click.

var previous_answers;
var isSingleChoice;

function check_mc(current_object) {
    var id = current_object.id.split('-')[0];

    var label = event.srcElement;
    //console.log(label, label.nodeName);
    var depth = 0;
    while ((label.nodeName != "LABEL") && (depth < 20)) {
        label = label.parentElement;
        // console.log(depth, label);
        depth++;
    }



    var answers = label.parentElement.children;

    //console.log(answers);


    // Split behavior based on multiple choice vs many choice:
    var fb = document.getElementById("fb" + id);
    //console.log(id, ", got numcorrect=",fb.dataset.numcorrect);
    // if (fb.dataset.numcorrect == 1) {

    // Testing for single choice only
    console.log(isSingleChoice)
    if (true) {
        for (var i = 0; i < answers.length; i++) {
            var child = answers[i];
            //console.log(child);
            child.className = "MCButton unchosenButton";
        }
        // without revealing any question info.
        fb.textContent = "Answer Chosen";
        label.className = "MCButton chosenButton";
        fb.className = "Feedback";
        fb.classList.add("pending");
    } else {
        fb.textContent = "Answer Chosen";
        label.className = "MCButton chosenButton";
        fb.className = "Feedback";
        fb.classList.add("chosen");
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

function make_selection() {
    let current_object = this;
    var id = current_object.id.split('-')[0];
    if (this.className === "MCButton chosenButton") {
        this.className = "MCButton";
        var fb = document.getElementById("fb" + id);
        fb.textContent = `Answer un-chosen`;
    } else {
        check_mc(this);
    }
}

function handle_output(out) {
    // save the previous read in answer to global var.
    previous_answers = out.content.text.split("\n");
}

function read_in_record() {
    var code_input = `f = open("record.txt", "r")`;
    var kernel = IPython.notebook.kernel;
    var callbacks = { 'iopub' : {'output' : handle_output}};
    kernel.execute(code_input)
    var msg_id = kernel.execute("print(f.read())", callbacks, {silent:false});
}

function record_answer() {
    let id = this.question_id;
    let record = document.getElementById("record" + id);

    let element = 0;
    let button = document.getElementById(`${id}-${element}`);

    // console.log(`${id}-${element}`);
    // console.log(button);

    while (button != null) {
        if (button.className === "MCButton chosenButton") {
            record.textContent = button.id;
        }
        element++;
        button = document.getElementById(`${id}-${element}`);
    }

    var fb = document.getElementById("fb" + id);
    fb.textContent = `Answer Recorded`;
    fb.className = "Feedback chosen"

    // Use IPython to save the result of the selection
    let kernel = IPython.notebook.kernel;
    // can direcly use imported method on jupyter notebook
    var command = `record_quiz("${id}", "${record.textContent}")`;
    kernel.execute(command);

    

}


function get_last_record(quiz_id) {
    read_in_record();

    if (previous_answers === undefined) {
        return;
    }

    for (let i = previous_answers.length - 1; i >= 0; i--) {

        let entry;
        if (previous_answers[i] === undefined) {
            continue;
        } 
        try {
            entry = eval(`(${previous_answers[i]})`);
        } catch (error) {
            continue;
        }

        if (entry["quiz_id"] === quiz_id) {
            return entry["option_id"];
        }
    }
}


function make_mc(qa, shuffle_answers, outerqDiv, qDiv, aDiv, id) {
    // isSingleChoice ture means only a single answer is ture
    read_in_record();
    // stop shuffling answer, unless we want unstable 
    // record
    shuffled = qa.answers;

    var num_correct = 0;

    // for single choice
    let changed = false;

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
        lab.id = id + '-' + index;

        let last_response = get_last_record(id);

        if (lab.id === last_response) {
            lab.className = "MCButton chosenButton";
        } else {
            lab.className = "MCButton";
        }

        lab.onclick = make_selection;
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
        }


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
