import sys
import serial
import time
from pymongo import MongoClient
import json

def fetch_details():
    client = MongoClient('mongodb+srv://choudharyaryan120203:iotAASS@cluster0.irhbpbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    db = client['Student']
    collection = db['Details']

    ser = serial.Serial(port='COM6', baudrate=9600, timeout=0)
    details = {}

    while True:
        time.sleep(0.001)
        val = ser.readline()
        while '\\n' not in str(val):
            time.sleep(0.001)
            temp = ser.readline()
            if temp.decode():
                val = (val.decode() + temp.decode()).encode()

        val = val.decode().strip()

        if "UID tag" in val.split(':')[0]:
            id = val.split(': ')[1]
            document = collection.find_one({"rfid": id})
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
                break

    return json.dumps(details)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "fetch":
        print(fetch_details())
