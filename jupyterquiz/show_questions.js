function jaxify(string) {
    var mystring = string;

    var count = 0;
    var loc = mystring.search(/([^\\]|^)(\$)/);

    var count2 = 0;
    var loc2 = mystring.search(/([^\\]|^)(\$\$)/);

    //console.log(loc);

    while ((loc >= 0) || (loc2 >= 0)) {

        /* Have to replace all the double $$ first with current implementation */
        if (loc2 >= 0) {
            if (count2 % 2 == 0) {
                mystring = mystring.replace(/([^\\]|^)(\$\$)/, "$1\\[");
            } else {
                mystring = mystring.replace(/([^\\]|^)(\$\$)/, "$1\\]");
            }
            count2++;
        } else {
            if (count % 2 == 0) {
                mystring = mystring.replace(/([^\\]|^)(\$)/, "$1\\(");
            } else {
                mystring = mystring.replace(/([^\\]|^)(\$)/, "$1\\)");
            }
            count++;
        }
        loc = mystring.search(/([^\\]|^)(\$)/);
        loc2 = mystring.search(/([^\\]|^)(\$\$)/);
        //console.log(mystring,", loc:",loc,", loc2:",loc2);
    }

    //console.log(mystring);
    return mystring;
}


function show_questions(json, mydiv) {
    console.log('show_questions');
    //var mydiv=document.getElementById(myid);
    var shuffle_questions = mydiv.dataset.shufflequestions;
    var num_questions = mydiv.dataset.numquestions;
    var shuffle_answers = mydiv.dataset.shuffleanswers;
    var max_width = mydiv.dataset.maxwidth;

    if (num_questions > json.length) {
        num_questions = json.length;
    }

    var questions;
    if ((num_questions < json.length) || (shuffle_questions == "True")) {
        //console.log(num_questions+","+json.length);
        questions = getRandomSubarray(json, num_questions);
    } else {
        questions = json;
    }

    //console.log("SQ: "+shuffle_questions+", NQ: " + num_questions + ", SA: ", shuffle_answers);

    // Iterate over questions
    questions.forEach((qa, index, array) => {
        //console.log(qa.question); 

        var id = makeid(8);
        //console.log(id);


        // Create Div to contain question and answers
        var iDiv = document.createElement('div');
        //iDiv.id = 'quizWrap' + id + index;
        iDiv.id = 'quizWrap' + id;
        iDiv.className = 'Quiz';
        iDiv.setAttribute('data-qnum', index);
        iDiv.style.maxWidth  =max_width+"px";
        mydiv.appendChild(iDiv);
        // iDiv.innerHTML=qa.question;
        
        var outerqDiv = document.createElement('div');
        outerqDiv.id = "OuterquizQn" + id + index;
        // Create div to contain question part
        var qDiv = document.createElement('div');
        qDiv.id = "quizQn" + id + index;
        
        if (qa.question) {
            iDiv.append(outerqDiv);

            //qDiv.textContent=qa.question;
            qDiv.innerHTML = jaxify(qa.question);
            outerqDiv.append(qDiv);
        }

        // Create div for code inside question
        var codeDiv;
        if ("code" in qa) {
            codeDiv = document.createElement('div');
            codeDiv.id = "code" + id + index;
            codeDiv.className = "QuizCode";
            var codePre = document.createElement('pre');
            codeDiv.append(codePre);
            var codeCode = document.createElement('code');
            codePre.append(codeCode);
            codeCode.innerHTML = qa.code;
            outerqDiv.append(codeDiv);
            //console.log(codeDiv);
        }


        // Create div to contain answer part
        var aDiv = document.createElement('div');
        aDiv.id = "quizAns" + id + index;
        aDiv.className = 'Answer';
        iDiv.append(aDiv);

        //console.log(qa.type);

        var num_correct;
        if ((qa.type == "multiple_choice") || (qa.type == "many_choice") ) {
            num_correct = make_mc(qa, shuffle_answers, outerqDiv, qDiv, aDiv, id);
            if ("answer_cols" in qa) {
                //aDiv.style.gridTemplateColumns = 'auto '.repeat(qa.answer_cols);
                aDiv.style.gridTemplateColumns = 'repeat(' + qa.answer_cols + ', 1fr)';
            }
        } else if (qa.type == "numeric") {
            //console.log("numeric");
            make_numeric(qa, outerqDiv, qDiv, aDiv, id);
        }


        //Make div for feedback
        var fb = document.createElement("div");
        fb.id = "fb" + id;
        //fb.style="font-size: 20px;text-align:center;";
        fb.className = "Feedback";
        fb.setAttribute("data-answeredcorrect", 0);
        fb.setAttribute("data-numcorrect", num_correct);
        iDiv.append(fb);


    });
    var preserveResponses = mydiv.dataset.preserveresponses;
    console.log(preserveResponses);
    console.log(preserveResponses == "true");
    if (preserveResponses == "true") {
        console.log(preserveResponses);
        // Create Div to contain record of answers
        var iDiv = document.createElement('div');
        iDiv.id = 'responses' + mydiv.id;
        iDiv.className = 'JCResponses';
        // Create a place to store responses as an empty array
        iDiv.setAttribute('data-responses', '[]');

        // Dummy Text
        iDiv.innerHTML="<b>Select your answers and then follow the directions that will appear here.</b>"
        //iDiv.className = 'Quiz';
        mydiv.appendChild(iDiv);
    }
//console.log("At end of show_questions");
    if (typeof MathJax != 'undefined') {
        console.log("MathJax version", MathJax.version);
        var version = MathJax.version;
        setTimeout(function(){
            var version = MathJax.version;
            console.log('After sleep, MathJax version', version);
            if (version[0] == "2") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            } else if (version[0] == "3") {
                if (MathJax.hasOwnProperty('typeset') ) {
                    MathJax.typeset([mydiv]);
                } else {
                    console.log('WARNING: Trying to force load MathJax 3');
                    window.MathJax = {
                        tex: {
                            inlineMath: [['$', '$'], ['\\(', '\\)']]
                        },
                        svg: {
                            fontCache: 'global'
                        }
                    };

                    (function () {
                        var script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
                        script.async = true;
                        document.head.appendChild(script);
                    })();
                }
            }
        }, 500);
if (typeof version == 'undefined') {
        } else
        {
            if (version[0] == "2") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            } else if (version[0] == "3") {
                if (MathJax.hasOwnProperty('typeset') ) {
                    MathJax.typeset([mydiv]);
                } else {
                    console.log('WARNING: Trying to force load MathJax 3');
                    window.MathJax = {
                        tex: {
                            inlineMath: [['$', '$'], ['\\(', '\\)']]
                        },
                        svg: {
                            fontCache: 'global'
                        }
                    };

                    (function () {
                        var script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
                        script.async = true;
                        document.head.appendChild(script);
                    })();
                }
            } else {
                console.log("MathJax not found");
            }
        }
    }
    return false;
}
