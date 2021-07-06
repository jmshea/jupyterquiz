from IPython.core.display import display, HTML
import random
import string


def display_quiz_mc(question, answers, multiple=False, randomize=True,
                    question_background="#6F78FF"):

    num_correct = 0

    question_start = '''<div id="quizWrap" style="max-width: 600px; margin: 0 auto;">
      <!-- QUESTION -->
      <div id="quizQn" style="padding: 20px;
      background: '''
    question_mid = ''';
      color: #fff;
      font-size: 20px;
      border-radius: 10px;">
      '''
    question_end = '</div>'

    answer_start = '''
      <!-- ANSWER -->
      <div id="quizAns" style="margin: 10px 0;
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 10px;">
      '''
    quiz_html = question_start+question_background+question_mid \
        + question+question_end+answer_start

    letters = string.ascii_letters
    feedback_id = ''.join(random.choice(letters) for i in range(12))
    # print(feedback_id)

    input_start = '''<input type="radio" name="quiz" id="quizo'''
    input_end = '''" style="display:none;" >'''
    label_start = '''<label style="background: #fafafa;
      border: 1px solid #eee;  border-radius: 10px; padding: 10px;
      font-size: 16px; cursor: pointer; text-align: center;" 
      onclick="check'''
    label_start += feedback_id
    label_start += '''()" 
      id="quizo'''
    label_end = '''  </label>'''

    if randomize:
        random.shuffle(answers)
    for i, answer in enumerate(answers):
        #quiz_html+=input_start+str(i)+ '" data-correct="' +str(answer["correct"]) \
        quiz_html += input_start+str(i) + input_end
        quiz_html += label_start+str(i) \
            + '" data-correct="' + str(answer["correct"]) \
            + '" data-feedback="' + str(answer["feedback"]) \
            + '" data-answered=0>'+answer["answer"]+label_end
        if answer["correct"]:
            num_correct += 1

    quiz_html += '''  </div></div>
    <div id="'''

    quiz_html += feedback_id
    quiz_html += '''" style="font-size: 20px;text-align:center;padding-bottom: 30px" data-answeredcorrect=0 data-numcorrect='''
    quiz_html += str(num_correct) + '''></div>'''

    javascript = """
        <script type="text/Javascript">

        function check"""
    javascript += feedback_id
    if multiple:
        javascript += """(){

                console.log(event.srcElement.id)           
                console.log(event.srcElement.dataset.correct)   
                console.log(event.srcElement.dataset.feedback)

                answers= event.srcElement.parentElement.children;
                console.log(answers);

                var feedback = document.getElementById("""
        javascript += '"'+feedback_id+'"'
        javascript += """);
                reset = false;
                if (event.srcElement.dataset.correct=="True" )   {
                    if (event.srcElement.dataset.answered<=0) {
                        if (feedback.dataset.answeredcorrect<0) {
                            feedback.dataset.answeredcorrect=1;
                            reset=true;
                        } else {
                           feedback.dataset.answeredcorrect++;
                        }
                        if (reset) {
                            for (var i = 0; i < answers.length; i++) {
                                child=answers[i];
                                child.style.background="#fafafa";
                                child.dataset.answered=0;
                            }
                        }
                        event.srcElement.style.background="#d8ffc4";
                        event.srcElement.dataset.answered=1;
                        feedback.style.color="#009113";

                    }
                } else {
                    if (feedback.dataset.answeredcorrect>0) {
                        feedback.dataset.answeredcorrect=-1;
                        reset=true;
                    } else {
                       feedback.dataset.answeredcorrect--;
                    }

                    if (reset) {
                        for (var i = 0; i < answers.length; i++) {
                            child=answers[i];
                            child.style.background="#fafafa";
                            child.dataset.answered=0;
                        }
                    }
                    event.srcElement.style.background="#ffe8e8";
                    feedback.style.color="#DC2329";
                }


                numcorrect=feedback.dataset.numcorrect;
                answeredcorrect=feedback.dataset.answeredcorrect;
                if (answeredcorrect>=0) {
                    feedback.innerHTML=event.srcElement.dataset.feedback + " [" \
                + answeredcorrect + "/" + numcorrect + "]";
                } else {
                    feedback.innerHTML=event.srcElement.dataset.feedback + "[" \
                + 0 + "/" + numcorrect + "]";
                }


            }

        </script>
        """
    else:
        javascript += """(){

                console.log(event.srcElement.id)           
                console.log(event.srcElement.dataset.correct)   
                console.log(event.srcElement.dataset.feedback)

                answers= event.srcElement.parentElement.children;
                console.log(answers);

                for (var i = 0; i < answers.length; i++) {
                    child=answers[i];
                    child.style.background="#fafafa";
                }
                var feedback = document.getElementById("""
        javascript += '"'+feedback_id+'"'
        javascript += """);
                feedback.innerHTML=event.srcElement.dataset.feedback;
                if (event.srcElement.dataset.correct=="True")   {
                    event.srcElement.style.background="#d8ffc4";
                    feedback.style.color="#009113";
                } else {
                    event.srcElement.style.background="#ffe8e8";
                    feedback.style.color="#DC2329";
                }




            }

        </script>
        """
    # print(javascript)

    display(HTML(quiz_html+javascript))
