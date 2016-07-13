import mysql.connector

class trafficSeeder:
    def __init__(self, cursor, traffic_status):

        self._cursor = cursor
        self._traffic_status = traffic_status

    def seed(self):
        for index, status in enumerate(self._traffic_status):
            insert_statement = (""
                "INSERT INTO traffic "
                "(id, status) "
                "VALUES (%(id)s, %(status)s);")
            data = {
                'id': index + 1,
                'status': status
            }

            try:
                self._cursor.execute(insert_statement, data)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)
                
