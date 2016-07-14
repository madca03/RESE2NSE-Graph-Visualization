from datetime import datetime
import random
import string
import mysql.connector

class nodePresentSeeder:
    def __init__(self, db_client, node_count_per_floor, floor_count):
        self.db_client = db_client
        self.cursor = db_client.cursor
        self._node_count_per_floor = node_count_per_floor
        self._floor_count = floor_count
        self.created_at = datetime.utcnow()

    def random_word(self):
        return ''.join(random.choice(string.ascii_uppercase) for i in range(12))

    def seed(self):
        node_count = 1

        for j in range(self._floor_count):
            for i in range(self._node_count_per_floor):
                insert_statement = (""
                    "INSERT INTO nodes_present "
                    "(id, node_id, x_coordinate, y_coordinate, coordinate_set, "
                    "last_transmission, packets_sent, packets_received, "
                    "created_at) "
                    "VALUES (%(id)s, %(node_id)s, %(x_coordinate)s, %(y_coordinate)s, "
                    "%(coordinate_set)s, %(last_transmission)s, %(packets_sent)s, "
                    "%(packets_received)s, %(created_at)s);")

                data = {
                    'id': node_count,
                    'node_id': node_count,
                    'x_coordinate': 0,
                    'y_coordinate': 0,
                    'coordinate_set': False,
                    'last_transmission': self.random_word(),
                    'packets_sent': random.randint(1,1000),
                    'packets_received': random.randint(1,1000),
                    'created_at': self.created_at
                }

                node_count += 1

                try:
                    self.cursor.execute(insert_statement, data)
                except mysql.connector.Error as err:
                    print("Error: {}".format(err))
                    exit(1)

        self.db_client.commit()
