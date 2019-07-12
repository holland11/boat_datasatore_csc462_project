node1=172.31.16.113
node2=172.31.21.63

docker container run -d -p 27017:27017 --name s0rs0 mongo --port 27017 --replSet s0 --shardsvr --smallfiles
docker container run -d -p 27018:27017 --name s0rs1 mongo --port 27017 --replSet s0 --shardsvr --smallfiles

docker container run -d -p 37017:27017 --name s1rs0 mongo --port 27017 --replSet s1 --shardsvr --smallfiles
docker container run -d -p 37018:27017 --name s1rs1 mongo --port 27017 --replSet s1 --shardsvr --smallfiles

docker container run -d -p 47017:27017 --name confrs0 mongo --port 27017 --replSet conf --configsvr --smallfiles
docker container run -d -p 47018:27017 --name confrs1 mongo --port 27017 --replSet conf --configsvr --smallfiles