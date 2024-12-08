import psycopg2
from psycopg2.extras import RealDictCursor
import pandas as pd
import numpy as np

class Database:
    def __init__(self):
        self.conn = self.connect_db()
        
    def connect_db(self):
        try:
            conn = psycopg2.connect(
                dbname="konnected_new",
                user="apple",
                password="",
                host="localhost",
                port=5432
            )
            print("Connected to the database.")
            return conn
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            return None

    def query_db(self, query, params=None):
        try:
            # If params is provided, traverse and convert numpy.int64 to int
            if params:
                params = self.convert_params(params)
            
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Use parameterized query to prevent SQL injection
                print("Query: ", query)
                print("Params: ", params)
                cur.execute(query, params)
                
                # Check if the query is a SELECT statement
                if query.strip().upper().startswith("SELECT"):
                    results = cur.fetchall()
                    return pd.DataFrame(results)
                else:
                    # For non-SELECT queries (like UPDATE or INSERT), commit the transaction
                    self.conn.commit()
                    return True
        except Exception as e:
            if self.conn:
                self.conn.rollback()
            print(f"Error querying the database: {e}")
            return None
    
    def convert_params(self, params):
        # If params is a tuple or list, iterate through each element and convert numpy.int64 and numpy.float64 to int and float respectively
        if isinstance(params, (tuple, list)):
            return tuple(
                int(param) if isinstance(param, np.int64) else 
                float(param) if isinstance(param, np.float64) else 
                param 
                for param in params
            )
        # If params is a single numpy.int64, convert it
        elif isinstance(params, np.int64):
            return int(params)
        # If params is a single numpy.float64, convert it
        elif isinstance(params, np.float64):
            return float(params)
        
        return params
        
    def close(self):
        self.conn.close()
        print("Database connection closed.")