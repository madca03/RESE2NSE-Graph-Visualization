import mysql.connector

class sensorSeeder:
    def __init__(self, db_client, sensors):
        self.db_client = db_client
        self.cursor = db_client.cursor
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
                self.cursor.execute(insert_statement, data)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)

        self.db_client.commit()
