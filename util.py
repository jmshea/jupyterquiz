def record_quiz(quiz_id, option_id):
    with open("record.txt", "a+") as f:
        output = {}
        output["quiz_id"] = quiz_id
        output["option_id"] = option_id
        f.write(str(output) + "\n")