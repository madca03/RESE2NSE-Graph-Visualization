import random
import string
from seeder.linkPresentSeeder import linkPresentSeeder
from datetime import datetime

class tableManager:
    def __init__(self, db_client):
        self._db_tables = {'nodes_present': nodesPresentTable(db_client),
                           'links_present': linksPresentTable(db_client)}

    def generate_random_data(self):
        self._generate_random_data('nodes_present')
        self._generate_random_data('links_present')

    def _generate_random_data(self, table):
        if table in self._db_tables:
            self._db_tables[table].update()
        else:
            raise ValueError("Invalid value for table: {0}".format(table))

class table:
    def __init__(self, db_client):
        self.db_client = db_client
        self.cursor = db_client.cursor

    def random_word(self):
        return ''.join(random.choice(string.ascii_uppercase) for i in range(12))

    def data_count(self, table):
        query = "SELECT COUNT(*) FROM {}".format(table)
        self.cursor.execute(query)
        (count,) = self.cursor.fetchone()
        return count

class linksPresentTable(table):
    def remove_data(self):
        self.cursor.execute('DELETE FROM links_present;')
        self.db_client.commit()

    def link_present_creation_date(self):
        query = 'SELECT DISTINCT(created_at) FROM nodes_present;'
        self.cursor.execute(query)
        (created_at,) = self.cursor.fetchone()
        return created_at

    def update(self):
        floor_count = self.data_count('floors')
        link_count = self.data_count('links_present')
        node_count = self.data_count('nodes')
        traffic_count = self.data_count('traffic')

        node_count_per_floor = int(node_count / floor_count)
        link_count_per_floor = int(link_count / floor_count)

        creation_date = self.link_present_creation_date()

        self.remove_data()

        linkPresentSeeder(self.db_client, link_count_per_floor,
            node_count_per_floor, floor_count, traffic_count,
            creation_date).seed()

class nodesPresentTable(table):
    def update(self):
        created_at = datetime.utcnow()

        for i in range(self.data_count('nodes_present')):
            update_statement = (""
                "UPDATE nodes_present "
                "SET last_transmission = %(last_transmission)s, "
                "packets_sent = %(packets_sent)s, "
                "packets_received = %(packets_received)s, "
                "created_at = %(created_at)s "
                "WHERE id = %(id)s;")

            data = {
                'last_transmission': self.random_word(),
                'packets_sent': random.randint(1,1000),
                'packets_received': random.randint(1,1000),
                'created_at': created_at,
                'id': i + 1
            }

            self.cursor.execute(update_statement,data)

        self.db_client.commit()
