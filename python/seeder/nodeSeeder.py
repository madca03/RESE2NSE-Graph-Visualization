from datetime import datetime
import random
import string
import mysql.connector

class nodeSeeder:
    def __init__(self, db_client, node_count_per_floor, floor_count):
        """ Constructor
        """
        self.db_client = db_client
        self.cursor = db_client.cursor
        self._node_count_per_floor = node_count_per_floor
        self._floor_count = floor_count
        self._table_name = 'nodes'

    def random_mac_address(self):
        return ''.join(random.choice(string.ascii_uppercase) for i in range(12))

    def seed(self):
        node_count = 1

        for j in range(self._floor_count):
            for i in range(self._node_count_per_floor):
                insert_statement = (""
                    "INSERT INTO nodes "
                    "(id, label, sensor_id, mac_address, floor_id, "
                    "created_at, updated_at) "
                    "VALUES (%(id)s, %(label)s, %(sensor_id)s, %(mac_address)s, "
                    "%(floor_id)s, %(created_at)s, %(updated_at)s);")

                data = {
                    'id': node_count,
                    'label': 'Node ' + str(node_count),
                    'sensor_id': random.randint(1,4),
                    'mac_address': self.random_mac_address(),
                    'floor_id': j + 1,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }

                node_count += 1

                try:
                    self.cursor.execute(insert_statement, data)
                except mysql.connector.Error as err:
                    print("Error: {}".format(err))
                    exit(1)

        self.db_client.commit()
