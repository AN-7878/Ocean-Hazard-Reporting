import json
import os
from datetime import datetime
from pymongo import MongoClient

# MongoDB setup
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'geodata_db'
COLLECTION_NAME = 'social_media_posts'

def populate_social_media_data():
    """Populates the social media collection from a JSON file."""
    print("Attempting to connect to MongoDB...")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        # Check for connection by pinging the server
        client.admin.command('ping')
        print("Successfully connected to MongoDB.")

        print(f"Checking if the '{COLLECTION_NAME}' collection is empty...")
        if collection.count_documents({}) == 0:
            print("Collection is empty. Proceeding with data population.")
            try:
                # Get the absolute path to the directory where the script is located
                script_dir = os.path.dirname(os.path.abspath(__file__))
                json_file_path = os.path.join(script_dir, 'social_media_posts_dummy_data.json')

                with open(json_file_path, 'r') as f:
                    data = json.load(f)
                    # Convert string timestamps to datetime objects
                    for post in data:
                        if 'timestamp' in post:
                            post['timestamp'] = datetime.strptime(post['timestamp'], "%Y-%m-%dT%H:%M:%SZ")
                    collection.insert_many(data)
                print("Social media data successfully populated.")
            except FileNotFoundError:
                print(f"Error: The file '{json_file_path}' was not found.")
                print("Please ensure 'social_media_posts_dummy_data.json' is in the same directory as this script.")
            except Exception as e:
                print(f"An error occurred while populating data from JSON file: {e}")
        else:
            print("Database already contains data. Skipping population.")
            
    except Exception as e:
        print(f"Failed to connect to MongoDB. Please ensure your MongoDB server is running: {e}")
    finally:
        if 'client' in locals() and client:
            client.close()

if __name__ == "__main__":
    populate_social_media_data()