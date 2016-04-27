import mysql.connector
from mysql.connector import errorcode
from datetime import datetime
from logger import log

class dbClient:
    """The DBClient class allows a user to connect to a mysql database given
    the user's credentials

    Attributes:
        _db_name (str): database to connect to
        _db_config (dict): contains the user's credentials
        _cnx (MySQLConnection): used for starting the connection
        _cursor (MySQLCursor): used for executing SQL statements

    """

    def __init__(self, db_config):
        """DBClient constructor

        Args:
            db_config: A dictionary containing the user's credentials and
                other database connection configurations.

                Expected keys from this dictionary are: (user, password,
                host).

        """

        self._db_config = db_config
        self._tag = 'dbClient'

    def start_connection(self):
        """This method creates a MySQLConnection object which is then used to
        connect to the specific MySQL database

        """

        log.d(self._tag, "Starting DB Connection")

        try:
            # create a mysql connection object
            self._cnx = mysql.connector.connect(**self._db_config)
            self._cnx.get_warnings = True

            # create a cursor object that will be used to execute SQL
            # statements
            self._cursor = self._cnx.cursor()

        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Error in username or password.")
            else:
                print("Error: {}".format(err))

            exit(1)

        log.d(self._tag, "Connected to MySQL")

    def use_database(self, db_name):
        """This method connects to a specific database. The DBClient object
        should have first started a mysql connection using the user's
        credential before this method can be called.

        Args:
            db_name (str): The name of the database to connect to.

        """

        self._db_name = db_name

        try:
            self._cnx.database = self._db_name
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database {0} does not exist.".format(self._db_name))
            else:
                print("Error: {}".format(err))

            exit(1)

        log.d(self._tag, "Connected to " + self._db_name + " database")

    def insert_node_archive_data(self, nodes):
        """This method inserts new links in the "node_archives" table.

        Args:
            nodes (list): contains the statement and values for the new data

        """

        self.insert_data(nodes)

    def insert_link_archive_data(self, links):
        """This method inserts new links in the "link_archives" table.

        Args:
            links (list): contains the statement and values for the new data

        """

        self.insert_data(links)


    def insert_data(self, data):
        """This method executes the SQL insert statement given the
        SQL statement and the data to be used in the insert operation.


        Args:
            data (list): list containing 2-element tuples of
                pre-formatted sql statement and values to be placed on the
                columns of the sql insert statement.

                The first element of each tuple is the pre-formatted sql
                statement while the second element is a dictionary of values
                to be used in the final sql statement.

                list[(statement1, data1), (statement2, data2), ...]

        """

        for (sql, values) in data:
            try:
                self._cursor.execute(sql, values)
            except mysql.connector.Error as err:
                print("Error: {}".format(err))
                exit(1)

    def create_node_archive(self):
        """This method creates an archive of the current nodes. It first
        queries all of the nodes from the "Nodes" table and then it stores
        the result set to the "Node_archives" table

        """

        self.query_nodes()

        nodes = []

        # After executing the query, the cursor object will contain a list
        # of tuples and each tuple represents a row in the result set

        for (node_id, label, x, y, coordinate_set, sensor_type, mac_address,
            last_transmission, packets_sent, packets_received,
            floor_number) in self._cursor:


            insert_archive_node_statement = (""
                "INSERT INTO node_archives "
                "(node_id, label, x, y, coordinate_set, sensor_type, "
                "mac_address, last_transmission, packets_sent, "
                "packets_received, floor_number, createdAt, updatedAt) "
                "VALUES ("
                "%(node_id)s, "
                "%(label)s, "
                "%(x)s, "
                "%(y)s, "
                "%(coordinate_set)s, "
                "%(sensor_type)s, "
                "%(mac_address)s, "
                "%(last_transmission)s, "
                "%(packets_sent)s, "
                "%(packets_received)s, "
                "%(floor_number)s, "
                "%(createdAt)s, "
                "%(updatedAt)s )")

            current_time = datetime.utcnow()

            data_archive_node = {
                'node_id': node_id,
                'label': label,
                'x': x,
                'y': y,
                'coordinate_set': coordinate_set,
                'sensor_type': sensor_type,
                'mac_address': mac_address,
                'last_transmission': last_transmission,
                'packets_sent': packets_sent,
                'packets_received': packets_received,
                'floor_number': floor_number,
                'createdAt': current_time,
                'updatedAt': current_time
            }

            nodes.append((insert_archive_node_statement, data_archive_node))

        # After creating the SQL insert statements for the archived nodes,
        # execute the SQL insert statements.
        self.insert_node_archive_data(nodes)
        self.insert_datetime_archive(current_time)

        return current_time

    def query_nodes(self):
        """This method queries all of the node objects from the Nodes table.

        """

        query = ("SELECT node_id, label, x, y, coordinate_set, sensor_type, "
            "mac_address, last_transmission, packets_sent, "
            "packets_received, floor_number FROM Nodes")

        self._cursor.execute(query)

    def insert_datetime_archive(self, current_time):
        """This method saves the date and time when the Nodes table is
        archived. It stores the new datetime of the archive in the
        Datetime_archives table.

            Args:
                current_time (datetime): the time when the Nodes table
                    is archived.

        """

        insert_statement = ("INSERT INTO Datetime_archives "
                            "(datetime_archive) "
                            "VALUES ("
                            "%s )")

        # Add extra comma to the tuple (current_time,)
        self._cursor.execute(insert_statement, (current_time,))

    def insert_links(self, links):
        """This method inserts new links in the Edges table

        Args:
            links (list): list of tuples containing the links to be added

        """

        self.insert_data(links)

    def update_links(self, links):
        """This method updates the links to be displayed by first removing the
        links and then inserting the new links

        Args:
            links (list): list of tuples containing the links to be added
        """

        self.remove_links()
        self.insert_links(links)


    def getNodeCount(self):
        """This method gets the total count of the nodes in the Nodes table

        """
        query = "SELECT COUNT(*) FROM Nodes"

        self._cursor.execute(query)

        for (node_count,) in self._cursor:
            return node_count

    def getFloorCount(self):
        """This method gets the number of floors.

        """

        query = "SELECT COUNT(*) FROM Floors"

        self._cursor.execute(query)

        for (floor_count,) in self._cursor:
            return floor_count

    def getNodeCountPerFloor(self):
        node_count = self.getNodeCount()
        floor_count = self.getFloorCount()

        return node_count / floor_count

    def getEdgeCount(self):
        query = "SELECT COUNT(*) FROM Edges"

        self._cursor.execute(query)

        for (edge_count,) in self._cursor:
            return edge_count

    def getEdgeCountPerFloor(self):
        edge_count = self.getEdgeCount()
        floor_count = self.getFloorCount()

        return edge_count / floor_count

    def remove_links(self):
        """This method removes all of the links in the Edges table

        """
        query = "DELETE FROM Edges"

        self._cursor.execute(query)

    def commit(self):
        """After all of the SQL statements are executed, the commit method
        of the cnx attribute (MySQLConnection object) should be called for
        the changes to take effect.

        """

        self._cnx.commit()

    def close_connection(self):
        """This method closes the database connection. This method should be
        called at the end of the program.

        """
        self._cursor.close()
        self._cnx.close()
