from dbClient import dbClient
from dbArchive import archiveManager
from dbTable import tableManager
from time import sleep
import sys
import signal

def handler(signum, frame):
    db_client.close_connection()
    print("Exiting...")
    sys.exit(0)


signal.signal(signal.SIGINT, handler)

db_config = {
    'user': 'rese2nse',
    'password': 'rese2nse',
    'host': '127.0.0.1'
}

db_client = dbClient(db_config)
db_client.start_connection()
db_client.use_database('graph')

sleep_time = 1

archive_manager = archiveManager(db_client)
table_manager = tableManager(db_client)

while True:
    print("Archiving nodes and adding new links")
    archive_manager.archive_database()

    print('Generating new random data')
    table_manager.generate_random_data()

    # pause for T seconds
    sleep(sleep_time)
