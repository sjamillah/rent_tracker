import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'db.json')


def read_db():
    """
    Read and return the entire database as a dict
    """
    with open(DB_PATH, 'r') as f:
        return json.load(f)
    
def write_db(data):
    """
    Write a dict back to the database file
    """
    with open(DB_PATH, 'w') as f:
        json.dump(data, f, indent=2)
