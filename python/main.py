from DBClient import DBClient
from random import random
from datetime import datetime
import math
from time import sleep
import sys

def generate_link_data(num_nodes, num_edges, time_of_archive):
    data_link_archives = []
    link_count = 1
    traffic = ['heavy', 'moderate', 'light']
    num_floors = 4

    for floor_number in range(num_floors):
        for i in range(num_edges):
            edge_id = 'e{0}'.format((link_count))
            traffic_index = math.floor(random() * len(traffic))

            while True:
                source = 'n{0}'.format((math.floor(random() * num_nodes + 1)) + (floor_number * num_nodes))
                target = 'n{0}'.format((math.floor(random() * num_nodes + 1)) + (floor_number * num_nodes))

                if source != target:
                    break

            data_link_archive = {
                'edge_id': edge_id,
                'source': source,
                'target': target,
                'traffic': traffic[traffic_index],
                'floor_number': floor_number + 1,
                'createdAt': time_of_archive,
                'updatedAt': time_of_archive
            }


            data_link_archives.append(data_link_archive)
            link_count = link_count + 1

    return data_link_archives


def generate_sql_insert_links(table_name, data_links):
    links = []

    for new_link in data_links:
        insert_header = "INSERT INTO {} ".format(table_name)
        insert_body = (""
            "(edge_id, source, target, traffic, floor_number, createdAt, "
            "updatedAt) "
            "VALUES (%(edge_id)s, %(source)s, %(target)s, %(traffic)s, "
            "%(floor_number)s, %(createdAt)s, %(updatedAt)s)")

        insert_link_statement = insert_header + insert_body

        links.append((insert_link_statement, new_link))

    return links

def main():
    db_config = {
        'user': 'rese2nse',
        'password': 'rese2nse',
        'host': '127.0.0.1'
    }

    db_client = DBClient(db_config)
    db_client.start_connection()
    db_client.use_database('graph')
    
    num_nodes = int(db_client.getNodeCountPerFloor())
    num_edges = int(db_client.getEdgeCountPerFloor())
    sleep_time = 5
    
    while True:
        print("Archiving nodes and adding new edges")
        time_of_archive = db_client.create_node_archive()

        data_links = generate_link_data(num_nodes, num_edges, time_of_archive)
        links_for_archive = generate_sql_insert_links('Edge_archives', data_links)
        db_client.insert_link_archive_data(links_for_archive)

        links_for_display = generate_sql_insert_links('Edges', data_links)
        db_client.update_links(links_for_display)
        db_client.commit()

        print("Done in archiving.")
        # wait for T seconds
        sleep(sleep_time)

    db_client.close_connection()

main()
