import mysql.connector
from mysql.connector import errorcode
from logger import log

class dbClient:
    """ The DBClient class allows a user to connect to a mysql database given
    the user's credentials

    Attributes:
        _db_name (str): database to connect to
        _db_config (dict): contains the user's credentials
        _cnx (MySQLConnection): used for starting the connection
        cursor (MySQLCursor): used for executing SQL statements
    """

    def __init__(self, db_config):
            """ DBClient constructor

            Args:
                db_config: A dictionary containing the user's credentials and
                    other database connection configurations.

                    Expected keys from this dictionary are: (user, password,
                    host).

            """

            self._db_config = db_config
            self._tag = 'dbClient'

    def start_connection(self):
        """ This method creates a MySQLConnection object which is then used to
        connect to the specific MySQL database.

        """

        log.d(self._tag, "Starting DB Connection")

        try:
            # create a mysql connection object
            self._cnx = mysql.connector.connect(**self._db_config)
            self._cnx.get_warnings = True

            # create a cursor object that will be used to execute SQL
            # statements
            self.cursor = self._cnx.cursor()

        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Error in username or password.")
            else:
                print("Error: {}".format(err))

            exit(1)

        log.d(self._tag, "Connected to MySQL")

    def use_database(self, db_name):
        """ This method connects to a specific database. The DBClient object
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
        self.cursor.close()
        self._cnx.close()
