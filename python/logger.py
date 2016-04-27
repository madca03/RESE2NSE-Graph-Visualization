from datetime import datetime

class log:
    def d(tag, msg):
        current_time = datetime.now()

        formatted_time = str(current_time.year) + "-" \
            + str(current_time.month) + "-" \
            + str(current_time.day) + " " \
            + str(current_time.hour) + ":" \
            + str(current_time.minute) + ":" \
            + str(current_time.second)

        print(formatted_time + " (" + tag + "): " + msg)
