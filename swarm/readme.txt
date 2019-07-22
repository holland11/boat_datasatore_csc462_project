To start the cluster, simply execute the command 'docker swarm init' then run ./startCluster.sh

This only starts the cluster with 1 shard.
To add more shards, use the ./addShard.sh script.
Give at least 2-3 minutes after running ./startCluster.sh before trying to add shards.
(Run the command 'mongo'. If it doesn't connect you, keep waiting and try again.
 If it does connect you, from within the mongos shell, run the command 'sh.status()'
 and look for the 'shards' attribute to make sure s0 has been added already.
 If s0 has been added succesfully, you are safe to add more shards.)

To use the addShard.sh script, you must include the shard number:
$ shard=1 ./addShard.sh
If the shard number has already been created, the script will not run.
Use 'docker service ls' to get a list of all the currently running services.

To check if your shard has been added successfully, run the 'mongo' command then
from within the mongos shell, run the 'sh.status()' command and look at the 'shards'
attribute to see if your shard has been added yet.
It may take a few minutes but shouldn't take longer than 2-3 minutes.
If it isn't being added, you can use the following troubleshooting techniques:
docker service ls 	# find the conf service for your recently added shard number.
docker service logs <service_id>	# if this return blank, the mongo_conf image isn't even being created

These two scripts will start the necessary services and also configure them properly.


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
then running the startCluster.sh script on the initial (manager) node should spread the 
containers out amongst all the worker nodes


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
docker system prune --volumes 	# delete many of your docker files which can fix certain problems
docker system prune -a --volumes 	# same as above but also deletes all your docker images
docker node ls 	# see all the nodes connected to the swarm
docker node inspect <node_id>
docker service ps <service_name> -- pretty	# shows you which node the service is currently running on