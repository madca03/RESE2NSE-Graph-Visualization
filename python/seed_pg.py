import psycopg2

try:
    conn = psycopg2.connect("dbname='graph' user='rese2nse' host='localhost' password='rese2nse'")
except:
    print("I am unable to connect to the database")
