from datetime import datetime
import mysql.connector

class floorSeeder:
    def __init__(self, db_client, floor_count):
        self.db_client = db_client
        self.cursor = db_client.cursor
        self._floor_count = floor_count

    def seed(self):
        for i in range(self._floor_count):
            insert_statement = (""
                "INSERT INTO floors "
                "(floor_number, image, created_at, updated_at) "
                "VALUES (%(floor_number)s, %(image)s, %(created_at)s, "
                "%(updated_at)s);")

            data = {
                'floor_number': i + 1,
                'image': 'floorplan' + str(i + 1),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }

            try:
                self.cursor.execute(insert_statement, data)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)

        self.db_client.commit()
