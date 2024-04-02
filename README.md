# Mosquitto testing

## Docker compose doc

```shell
# Run the test infrastrucuture
docker compose up -d
```
```shell
# Run the replicated infrastructure
docker compose -f docker-compose.replicated.yaml up -d
```
## Additional doc

Usefull commands for mqtt testing

```shell
#publish to topic test 
mosquitto_pub -h 127.0.0.1 -t test -m "hola"

#subscribe to topic test
mosquitto_sub -h 127.0.0.1 -t test
```