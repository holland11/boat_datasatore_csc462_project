steps to run the swarm locally:

(optional) run the following command to clean your docker related files:
(this may delete some stuff you don't want it to though so be aware)
docker system prune --volumes

enter the ./mongos_conf_image/ directory
docker build -t mongos_conf .

enter the ./rs_conf_image/ directory
docker build -t rs_conf .

come back to this directory ./
docker swarm init
docker stack deploy -c docker-compose.yml cluster

wait at least 2 minutes for the swarm to start up and configure itself then
mongo
to connect to the mongos router

from within the mongos router
use boat
db.parts.getShardDistribution() # this shows how the data has been distributed between the shards
sh.status() # this shows the status of your cluster (make sure all your shards show up)

from outside of mongo
mongoimport -d <dbname> -c <collection name> --file=<csv filename> --type csv --headerline
ex. mongoimport -d boat -c parts --file=trimmed.csv --type csv --headerline
this will add each row from the csv into the db and it should spread it out between the shards
if it doesn't get spread out across different shards, it might be due to the chunksize being too large
chunksize is set to 2mb within the init.sh script that gets run by the mong_conf docker image 


if you want to deploy the swarm in a distributed fashion, after running
docker swarm init
you will be presented with a command that you can run on the other machines to have them join the swarm
then running 
docker stack deploy -c docker-compose.yml cluster
on the initial (manager) node should spread the containers out amongst all the worker nodes


To add a new service to the swarm that isn't part of the initial docker-compose file
that gets run with docker stack deploy, use the following command:
docker service create --network <swarm_network_name> --name <service_name> <image> <commands>
ex. docker service create --network cluster_default --name temp_mong mongo --port 27017

If you omit the network, or you get the network name wrong, your new service won't be able to
access the original swarm services by their hostnames (ex. s0rs0, mongos0, etc.)
docker network ls # to see the networks
docker network inspect <network_id> # to see which containers are currently on this network



Troubleshooting:

docker service ps --no-trunc {serviceName}  # see why a service is crashing
docker service ls
docker service logs <service id>
docker logs <container_id>