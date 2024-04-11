import os
import sys
import json
import paho.mqtt.client as mqtt
from influxdb_client import InfluxDBClient, Point, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS

INFLUXDB_URL = os.getenv('INFLUXDB_URL', 'http://influxdb:8086')
INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN', 'c6c49c0a9d718d3650299a6cb082ed5e')
INFLUXDB_ORG = os.getenv('INFLUXDB_ORG', 'codan')
INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET', 'metrics')
MQTT_BROKER = os.getenv('MQTT_BROKER', 'mosquitto')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'sensor/#')

required_configs = [INFLUXDB_URL, INFLUXDB_TOKEN, INFLUXDB_ORG, INFLUXDB_BUCKET, MQTT_BROKER, MQTT_PORT, MQTT_TOPIC]
if any(c is None for c in required_configs):
    sys.exit("Missing required configuration. Exiting.")

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

def connect_mqtt():
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.subscribe(MQTT_TOPIC)
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")
        sys.exit(1)

mqtt_client.on_message = on_message
mqtt_client.on_disconnect = lambda client, userdata, rc: connect_mqtt()

connect_mqtt()

try:
    mqtt_client.loop_forever()
except KeyboardInterrupt:
    print("Disconnecting from MQTT...")
    mqtt_client.disconnect()
except Exception as e:
    print(f"Unexpected error: {e}")
    sys.exit(1)
