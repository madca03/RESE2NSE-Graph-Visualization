import mysql.connector

class trafficSeeder:
    def __init__(self, db_client, traffic_status):
        self.db_client = db_client
        self.cursor = db_client.cursor
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
                self.cursor.execute(insert_statement, data)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)

        self.db_client.commit()
