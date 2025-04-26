// Override show_questions to use object-oriented Question API
function show_questions(json, container) {
    // Accept container element or element ID
    if (typeof container === 'string') {
        container = document.getElementById(container);
    }
    if (!container) {
        console.error('show_questions: invalid container', container);
        return;
    }

    const shuffleQuestions = container.dataset.shufflequestions === 'True';
    const shuffleAnswers = container.dataset.shuffleanswers === 'True';
    const preserveResponses = container.dataset.preserveresponses === 'true';
    const maxWidth = parseInt(container.dataset.maxwidth, 10) || 0;
    let numQuestions = parseInt(container.dataset.numquestions, 10) || json.length;
    if (numQuestions > json.length) numQuestions = json.length;

    let questions = json;
    if (shuffleQuestions || numQuestions < json.length) {
        questions = getRandomSubarray(json, numQuestions);
    }

    questions.forEach((qa, index) => {
        const id = makeid(8);
        const options = {
            shuffleAnswers: shuffleAnswers,
            preserveResponses: preserveResponses,
            maxWidth: maxWidth
        };
        Question.create(qa, id, index, options, container);
    });

    if (preserveResponses) {
        const respDiv = document.createElement('div');
        respDiv.id = 'responses' + container.id;
        respDiv.className = 'JCResponses';
        respDiv.dataset.responses = JSON.stringify([]);
        respDiv.innerHTML = '<b>Select your answers and then follow the directions that will appear here.</b>';
        container.appendChild(respDiv);
    }

    // Trigger MathJax typesetting if available
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
                    MathJax.typeset([container]);
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
                    MathJax.typeset([container]);
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
    // if (typeof MathJax !== 'undefined') {
    //     const v = MathJax.version;
    //     if (v[0] === '2') {
    //         MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    //     } else if (v[0] === '3') {
    //         MathJax.typeset([container]);
    //     }
    // }

    // Prevent link clicks from bubbling up
    Array.from(container.getElementsByClassName('Link')).forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });
}
