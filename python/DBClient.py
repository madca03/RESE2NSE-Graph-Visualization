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
            self._cursor = self._cnx.cursor(buffered = True)

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

    def new_nodes_archive_id(self):
        query = "SELECT MAX(id) FROM nodes_archive;"

        self._cursor.execute(query)

        for (last_row_id,) in self._cursor:
            if last_row_id == None:
                return 1
            else:
                return last_row_id + 1

    def new_datetime_archive(self):
        query = "SELECT MAX(id) FROM datetime_archive;"

        self._cursor.execute(query)

        new_id = 0

        for (last_row_id,) in self._cursor:
            if last_row_id == None:
                new_id = 1
            else:
                new_id = last_row_id + 1

        query = "SELECT created_at FROM nodes_present;"

        self._cursor.execute(query)

        # check if "nodes_present" table is empty
        if self._cursor.rowcount == 0:
            return (None, None)
        else:
            (created_at,) = self._cursor.fetchone()
            return (new_id, created_at)

    def create_node_archive(self):
        """This method creates an archive of the current nodes. It first
        queries all of the nodes from the "Nodes" table and then it stores
        the result set to the "Node_archives" table

        """
        nodes_archive_id = self.new_nodes_archive_id()
        (date_created_id, created_at) = self.new_datetime_archive()

        if date_created_id == None:
            return

        self.query_nodes()

        nodes = []

        # After executing the query, the cursor object will contain a list
        # of tuples and each tuple represents a row in the result set

        for (node_id, x_coordinate, y_coordinate, coordinate_set,
            last_transmission, packets_sent, packets_received,) in self._cursor:

            insert_archive_node_statement = (""
                "INSERT INTO nodes_archive "
                "(id, node_id, x_coordinate, y_coordinate, coordinate_set, "
                "last_transmission, packets_sent, "
                "packets_received, date_created_id) "
                "VALUES ("
                "%(id)s, "
                "%(node_id)s, "
                "%(x_coordinate)s, "
                "%(y_coordinate)s, "
                "%(coordinate_set)s, "
                "%(last_transmission)s, "
                "%(packets_sent)s, "
                "%(packets_received)s, "
                "%(date_created_id)s);")

            data_archive_node = {
                'id': nodes_archive_id,
                'node_id': node_id,
                'x_coordinate': x_coordinate,
                'y_coordinate': y_coordinate,
                'coordinate_set': coordinate_set,
                'last_transmission': last_transmission,
                'packets_sent': packets_sent,
                'packets_received': packets_received,
                'date_created_id': date_created_id,
            }

            nodes_archive_id += 1
            nodes.append((insert_archive_node_statement, data_archive_node))

        # After creating the SQL insert statements for the archived nodes,
        # execute the SQL insert statements.
        self.insert_node_archive_data(nodes)
        self.insert_datetime_archive(date_created_id,created_at)
        self.time_of_archive_id = date_created_id

    def new_links_archive_id(self):
        """This method queries for the last id stored in the "links_archive"
        table. It then returns the next id for the insertion of new data in
        "links_archive" table.

        """

        query = "SELECT MAX(id) FROM links_archive;"

        self._cursor.execute(query)
        (last_row_id,) = self._cursor.fetchone()

        if last_row_id == None:
            return 1
        else:
            return last_row_id + 1

    def query_links_present(self):
        query = (""
            "SELECT id, source_id, target_id, traffic_id, floor_id "
            "FROM links_present;")

        self._cursor.execute(query)


    def create_link_archive(self):
        """ This method copies the data in the "edges_present" table to
        "edges_archive" table

        """
        link_archive_id = self.new_links_archive_id()

        self.query_links_present()
        rows = self._cursor.fetchall()
        links = []

        for (link_id, source_id, target_id, traffic_id, floor_id) in rows:
            insert_statement = (""
                "INSERT INTO links_archive "
                "(id, link_id, source_id, target_id, traffic_id, floor_id, "
                "date_created_id) "
                "VALUES ( "
                "%(id)s, "
                "%(link_id)s, "
                "%(source_id)s, "
                "%(target_id)s, "
                "%(traffic_id)s, "
                "%(floor_id)s, "
                "%(date_created_id)s);")

            data = {
                'id': link_archive_id,
                'link_id': link_id,
                'source_id': source_id,
                'target_id': target_id,
                'traffic_id': traffic_id,
                'floor_id': floor_id,
                'date_created_id': self.time_of_archive_id,
            }

            link_archive_id += 1

            self._cursor.execute(insert_statement, data)

    def query_nodes(self):
        """This method queries all of the node objects from the "nodes_present" table.

        """

        query = ("SELECT node_id, x_coordinate, y_coordinate, coordinate_set, "
            "last_transmission, packets_sent, "
            "packets_received FROM nodes_present;")

        self._cursor.execute(query)

    def get_datetime_archive_last_row_id(self):
        query = "SELECT MAX(id) FROM datetime_archive;"

        self._cursor.execute(query);
        for (last_row_id,) in self._cursor:
            return last_row_id

    def insert_datetime_archive(self, date_created_id, created_at):
        """This method saves the date and time when the Nodes table is
        archived. It stores the new datetime of the archive in the
        Datetime_archives table.

            Args:
                created_at (datetime): the time when the Nodes table
                    is archived.

        """

        insert_statement = ("INSERT INTO datetime_archive "
                            "(id, datetime_archive) "
                            "VALUES (%s, %s);")

        # Add extra comma to the tuple (current_time,)
        self._cursor.execute(insert_statement, (date_created_id, created_at,))

    def insert_links(self, links):
        """This method inserts new links in the Links table

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
        """This method gets the total count of the nodes in the "nodes" table

        """
        query = "SELECT COUNT(*) FROM nodes;"

        self._cursor.execute(query)

        for (node_count,) in self._cursor:
            return node_count

    def getFloorCount(self):
        """This method gets the number of floors.

        """

        query = "SELECT COUNT(*) FROM floors;"

        self._cursor.execute(query)

        for (floor_count,) in self._cursor:
            return floor_count

    def getNodeCountPerFloor(self):
        node_count = self.getNodeCount()
        floor_count = self.getFloorCount()

        if node_count != 0 and floor_count != 0:
            return node_count / floor_count
        else:
            return 0

    def getLinkCount(self):
        query = "SELECT COUNT(*) FROM links_present;"

        self._cursor.execute(query)

        for (link_count,) in self._cursor:
            return link_count

    def getLinkCountPerFloor(self):
        link_count = self.getLinkCount()
        floor_count = self.getFloorCount()

        if link_count != 0 and floor_count != 0:
            return link_count / floor_count
        else:
            return 0

    def remove_links(self):
        """This method removes all of the links in the Links table

        """
        query = "DELETE FROM Links"

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
