import sys
import serial
import time
from pymongo import MongoClient
import json

def fetch_details(regno):
    client = MongoClient('mongodb+srv://choudharyaryan120203:iotAASS@cluster0.irhbpbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    db = client['Student']
    collection = db['Reg']
    # print(regno)
    document = collection.find_one({"regno": regno})
    if document:
        details = {
            "name": document.get("name"),
            "regno": document.get("regno"),
            "block": document.get("block"),
            "room": document.get("room"),
            "parentmail": document.get("parentmail"),
            "proctormail": document.get("proctormail"),
            "studentmail": document.get("studentmail")
        }
        return json.dumps(details)
    else:
        return json.dumps({"error": "Student not found"})

if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "fetch":
        # print(sys.argv[2])
        print(fetch_details(sys.argv[2]))
