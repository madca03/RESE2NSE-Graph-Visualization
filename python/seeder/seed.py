from dbClient import dbClient
from nodeSeeder import nodeSeeder
from floorSeeder import floorSeeder
from sensorSeeder import sensorSeeder
from trafficSeeder import trafficSeeder
from nodePresentSeeder import nodePresentSeeder
from linkPresentSeeder import linkPresentSeeder

db_config = {
    'user': 'rese2nse',
    'password': 'rese2nse',
    'host': '127.0.0.1'
}

db_client = dbClient(db_config)
db_client.start_connection()
db_client.use_database('graph')

floor_count = 4
traffic_status = ['Light', 'Moderate', 'Heavy']
sensor_types = ['Humidity', 'Temperature', 'Light', 'Pressure']
node_count_per_floor = 10
link_count_per_floor = 15

floorSeeder(db_client.cursor, floor_count).seed()

trafficSeeder(db_client.cursor, traffic_status).seed()

sensorSeeder(db_client.cursor, sensor_types).seed()

nodeSeeder(db_client.cursor, node_count_per_floor, floor_count).seed()

node_present_seeder = nodePresentSeeder(db_client.cursor, node_count_per_floor, floor_count)
node_present_seeder.seed()

linkPresentSeeder(db_client.cursor, link_count_per_floor,
    node_count_per_floor, floor_count, len(traffic_status),
    node_present_seeder.created_at).seed()

db_client.commit()
db_client.close_connection()
