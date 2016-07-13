import mysql.connector

class sensorSeeder:
    def __init__(self, cursor, sensors):

        self._cursor = cursor
        self._sensors = sensors

    def seed(self):
        for index, sensor in enumerate(self._sensors):
            insert_statement = (""
                "INSERT INTO sensors "
                "(id, type) "
                "VALUES (%(id)s, %(type)s);")

            data = {
                'id': index + 1,
                'type': sensor
            }

            try:
                self._cursor.execute(insert_statement, data)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)
