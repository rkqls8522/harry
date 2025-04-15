import pymysql
from dbutils.pooled_db import PooledDB


DB_POOL = PooledDB(
    creator=pymysql,
    maxconnections=5,
    mincached=1,
    maxcached=3,
    host='stg-yswa-kr-practice-db-master.mariadb.database.azure.com',
    port=3306,
    user='S12P22A408@stg-yswa-kr-practice-db-master',
    password='t9hurA0fqX',
    database='S12P22A408',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

def get_db_connection():
    
    return DB_POOL.connection()
