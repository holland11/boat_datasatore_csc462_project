
# 'docker swarm init' must have already been called to run this script

# build the necessary docker images
#docker build -t mongo_conf ./mongo_conf_image/
#docker build -t web_app ./web_image/

# create the docker network to be used by the swarm
docker network create --attachable --driver overlay cluster_net
docker stack deploy -c docker-compose.yml cluster
