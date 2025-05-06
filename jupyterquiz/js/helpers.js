// Make a random ID
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
// Convert LaTeX delimiters and markdown links to HTML
function jaxify(string) {
    let mystring = string;
    let count = 0, count2 = 0;
    let loc = mystring.search(/([^\\]|^)(\$)/);
    let loc2 = mystring.search(/([^\\]|^)(\$\$)/);
    while (loc >= 0 || loc2 >= 0) {
        if (loc2 >= 0) {
            mystring = mystring.replace(/([^\\]|^)(\$\$)/, count2 % 2 ? '$1\\]' : '$1\\[');
            count2++;
        } else {
            mystring = mystring.replace(/([^\\]|^)(\$)/, count % 2 ? '$1\\)' : '$1\\(');
            count++;
        }
        loc = mystring.search(/([^\\]|^)(\$)/);
        loc2 = mystring.search(/([^\\]|^)(\$\$)/);
    }
    // Replace markdown links
    mystring = mystring.replace(/<http(.*?)>/g, '<a href="http$1" target="_blank" class="Link">http$1</a>');
    mystring = mystring.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="Link">$1</a>');
    return mystring;
}

// Base class for question types
class Question {
    static registry = {};
    static register(type, cls) {
        Question.registry[type] = cls;
    }
    static create(qa, id, index, options, rootDiv) {
        const Cls = Question.registry[qa.type];
        if (!Cls) {
            console.error(`No question class registered for type "${qa.type}"`);
            return;
        }
        const q = new Cls(qa, id, index, options, rootDiv);
        q.render();
    }

    constructor(qa, id, index, options, rootDiv) {
        this.qa = qa;
        this.id = id;
        this.index = index;
        this.options = options;
        this.rootDiv = rootDiv;
        // wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.id = `quizWrap${id}`;
        this.wrapper.className = 'Quiz';
        this.wrapper.dataset.qnum = index;
        this.wrapper.style.maxWidth = `${options.maxWidth}px`;
        rootDiv.appendChild(this.wrapper);
        // question container
        this.outerqDiv = document.createElement('div');
        this.outerqDiv.id = `OuterquizQn${id}${index}`;
        this.wrapper.appendChild(this.outerqDiv);
        // question text
        this.qDiv = document.createElement('div');
        this.qDiv.id = `quizQn${id}${index}`;
        if (qa.question) {
            this.qDiv.innerHTML = jaxify(qa.question);
            this.outerqDiv.appendChild(this.qDiv);
        }
        // code block
        if (qa.code) {
            const codeDiv = document.createElement('div');
            codeDiv.id = `code${id}${index}`;
            codeDiv.className = 'QuizCode';
            const pre = document.createElement('pre');
            const codeEl = document.createElement('code');
            codeEl.innerHTML = qa.code;
            pre.appendChild(codeEl);
            codeDiv.appendChild(pre);
            this.outerqDiv.appendChild(codeDiv);
        }
        // answer container
        this.aDiv = document.createElement('div');
        this.aDiv.id = `quizAns${id}${index}`;
        this.aDiv.className = 'Answer';
        this.wrapper.appendChild(this.aDiv);
        // feedback container (append after answers)
        this.fbDiv = document.createElement('div');
        this.fbDiv.id = `fb${id}`;
        this.fbDiv.className = 'Feedback';
        this.fbDiv.dataset.answeredcorrect = 0;
    }

    render() {
        throw new Error('render() not implemented');
    }

    preserveResponse(val) {
        if (!this.options.preserveResponses) return;
        const resp = document.getElementById(`responses${this.rootDiv.id}`);
        if (!resp) return;
        const arr = JSON.parse(resp.dataset.responses);
        arr[this.index] = val;
        resp.dataset.responses = JSON.stringify(arr);
        printResponses(resp);
    }

    typeset(container) {
        if (typeof MathJax !== 'undefined') {
            const v = MathJax.version;
            if (v[0] === '2') {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
            } else {
                MathJax.typeset([container]);
            }
        }
    }
}

// Choose a random subset of an array. Can also be used to shuffle the array
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function printResponses(responsesContainer) {
    var responses=JSON.parse(responsesContainer.dataset.responses);
    var stringResponses='<B>IMPORTANT!</B>To preserve this answer sequence for submission, when you have finalized your answers: <ol> <li> Copy the text in this cell below "Answer String"</li> <li> Double click on the cell directly below the Answer String, labeled "Replace Me"</li> <li> Select the whole "Replace Me" text</li> <li> Paste in your answer string and press shift-Enter.</li><li>Save the notebook using the save icon or File->Save Notebook menu item</li></ul><br><br><br><b>Answer String:</b><br> ';
    console.log(responses);
    responses.forEach((response, index) => {
        if (response) {
            console.log(index + ': ' + response);
            stringResponses+= index + ': ' + response +"<BR>";
        }
    });
    responsesContainer.innerHTML=stringResponses;
}
