from paho.mqtt import client as mqtt_client
from serial import Serial

broker = "localhost"
port = 1883
topic = "hello/group0"
client_id = "hello-group0-0"

com_port = "/dev/ttyACM0"
baudrate = 9600

def connect_mqtt():
	def on_connect(client, userdata, flags, rc):
		if rc == 0:
			print("Connected to MQTT broker")
		else:
			print("Failed to connect to MQTT broker")

	client = mqtt_client.Client(client_id)
	client.on_connect = on_connect
	client.connect(broker, port)
	return client

def publish(ser, client):
	while True:
		msg = ser.readline().decode("utf-8").strip()
		print("received from LoRa: " + msg)
		result = client.publish(topic, msg)
		status = result[0]
		if status == 0:
			print("Message sent to topic")
		else:
			print("Failed to send message to topic")

if __name__ == '__main__':
	try:
		ser = Serial(com_port, baudrate)
		client = connect_mqtt()
		client.loop_start()
		publish(ser, client)
	except Exception as e:
		print(e)
		exit()
