from datetime import datetime
import mysql.connector
import random

class linkPresentSeeder:
    def __init__(self, db_client, link_count_per_floor, node_count_per_floor, floor_count, traffic_count,
        created_at):
        self.db_client = db_client
        self.cursor = db_client.cursor
        self._link_count_per_floor = link_count_per_floor
        self._node_count_per_floor = node_count_per_floor
        self._floor_count = floor_count
        self._traffic_count = traffic_count
        self.created_at = created_at

    def seed(self):
        link_count = 1
        node_pairs = []

        for floor_number in range(self._floor_count):
            for i in range(self._link_count_per_floor):
                insert_statement = (""
                    "INSERT INTO links_present "
                    "(id, source_id, target_id, traffic_id, floor_id, "
                    "created_at)"
                    "VALUES (%(id)s, %(source_id)s, %(target_id)s, "
                    "%(traffic_id)s, %(floor_id)s, %(created_at)s);")

                while True:
                    source_id = random.randint(1, self._node_count_per_floor) + (floor_number * self._node_count_per_floor)
                    target_id = random.randint(1, self._node_count_per_floor) + (floor_number * self._node_count_per_floor)

                    if (source_id != target_id) and \
                        ((source_id, target_id) not in node_pairs):
                        break

                node_pairs.append((source_id,target_id))

                data = {
                    'id': link_count,
                    'source_id': source_id,
                    'target_id': target_id,
                    'traffic_id': random.randint(1, self._traffic_count),
                    'floor_id': floor_number + 1,
                    'created_at': self.created_at
                }

                link_count += 1

                try:
                    self.cursor.execute(insert_statement, data)
                except mysql.connector.Error as err:
                    print("Error: {}".format(err))
                    exit(1)

        self.db_client.commit()
