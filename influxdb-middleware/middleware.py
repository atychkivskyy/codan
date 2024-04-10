import os
import sys
import json
import paho.mqtt.client as mqtt
from influxdb_client import InfluxDBClient, Point, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS


INFLUXDB_URL = os.getenv('INFLUXDB_URL')
INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN')
INFLUXDB_ORG = os.getenv('INFLUXDB_ORG')
INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET')

MQTT_BROKER = os.getenv('MQTT_BROKER')
MQTT_PORT = int(os.getenv('MQTT_PORT'))
MQTT_TOPIC = os.getenv('MQTT_TOPIC')

client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
write_api = client.write_api(write_options=SYNCHRONOUS)

def on_message(client, userdata, message):
    try:
        data = json.loads(message.payload.decode('utf-8'))

        point = Point("sensor_data") \
            .tag("sensor_id", data["sensor_id"]) \
            .field(message.topic.split('/')[-1], data[message.topic.split('/')[-1]]) \
            .time(data["time"])

        write_api.write(bucket=INFLUXDB_BUCKET, record=point)
        print(f"Data written to InfluxDB: {data} on topic: {message.topic}")
    except Exception as e:
        print(f"Error processing message: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.subscribe(MQTT_TOPIC)

try:
    mqtt_client.loop_forever()
except KeyboardInterrupt:
    print("Disconnecting from MQTT...")
    mqtt_client.disconnect()
except Exception as e:
    print(f"Unexpected error: {e}")
    sys.exit(1)
