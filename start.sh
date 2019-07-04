# MongoDB
# script to start a sharded environment on localhost
# https://premaseem.wordpress.com/2016/02/14/mongodb-script-to-run-sharding-with-replica-set-on-local-machine/

# clean everything up
echo "killing mongod and mongos"
killall mongod
killall mongos
echo "removing data files"
rm -rf /data/config
rm -rf /data/shard*
rm -rf /data/logs

mkdir /data/logs


# start a replica set and tell it that it will be shard0
echo "starting servers for shard 0"
mkdir -p /data/shard0/rs0 /data/shard0/rs1 /data/shard0/rs2
mongod --replSet s0 --logpath "/data/logs/s0-r0.log" --dbpath /data/shard0/rs0 --port 27017 --fork --shardsvr --smallfiles
mongod --replSet s0 --logpath "/data/logs/s0-r1.log" --dbpath /data/shard0/rs1 --port 27018 --fork --shardsvr --smallfiles
mongod --replSet s0 --logpath "/data/logs/s0-r2.log" --dbpath /data/shard0/rs2 --port 27019 --fork --shardsvr --smallfiles

sleep 5
# connect to one server and initiate the set
echo "Configuring s0 replica set"
mongo --port 27017 << 'EOF'
config = { _id: "s0", members:[
          { _id : 0, host : "localhost:27017" },
          { _id : 1, host : "localhost:27018" },
          { _id : 2, host : "localhost:27019" }]};
rs.initiate(config)
EOF

# start a replicate set and tell it that it will be a shard1
echo "starting servers for shard 1"
mkdir -p /data/shard1/rs0 /data/shard1/rs1 /data/shard1/rs2
mongod --replSet s1 --logpath "/data/logs/s1-r0.log" --dbpath /data/shard1/rs0 --port 37017 --fork --shardsvr --smallfiles
mongod --replSet s1 --logpath "/data/logs/s1-r1.log" --dbpath /data/shard1/rs1 --port 37018 --fork --shardsvr --smallfiles
mongod --replSet s1 --logpath "/data/logs/s1-r2.log" --dbpath /data/shard1/rs2 --port 37019 --fork --shardsvr --smallfiles

sleep 5

echo "Configuring s1 replica set"
mongo --port 37017 << 'EOF'
config = { _id: "s1", members:[
          { _id : 0, host : "localhost:37017" },
          { _id : 1, host : "localhost:37018" },
          { _id : 2, host : "localhost:37019" }]};
rs.initiate(config)
EOF

# start a replicate set and tell it that it will be a shard2
echo "starting servers for shard 2"
mkdir -p /data/shard2/rs0 /data/shard2/rs1 /data/shard2/rs2
mongod --replSet s2 --logpath "/data/logs/s2-r0.log" --dbpath /data/shard2/rs0 --port 47017 --fork --shardsvr --smallfiles
mongod --replSet s2 --logpath "/data/logs/s2-r1.log" --dbpath /data/shard2/rs1 --port 47018 --fork --shardsvr --smallfiles
mongod --replSet s2 --logpath "/data/logs/s2-r2.log" --dbpath /data/shard2/rs2 --port 47019 --fork --shardsvr --smallfiles

sleep 5

echo "Configuring s2 replica set"
mongo --port 47017 << 'EOF'
config = { _id: "s2", members:[
          { _id : 0, host : "localhost:47017" },
          { _id : 1, host : "localhost:47018" },
          { _id : 2, host : "localhost:47019" }]};
rs.initiate(config)
EOF


# now start 3 config servers
echo "Starting config servers"
mkdir -p /data/config/config-a /data/config/config-b /data/config/config-c
mongod --replSet conf --logpath "/data/logs/cfg-a.log" --dbpath /data/config/config-a --port 47040 --fork --configsvr --smallfiles
mongod --replSet conf --logpath "/data/logs/cfg-b.log" --dbpath /data/config/config-b --port 47041 --fork --configsvr --smallfiles
mongod --replSet conf --logpath "/data/logs/cfg-c.log" --dbpath /data/config/config-c --port 47042 --fork --configsvr --smallfiles

echo "Configuring config replica set"
mongo --port 47040 << 'EOF'
config = { _id: "conf", members:[
          { _id : 0, host : "localhost:47040" },
          { _id : 1, host : "localhost:47041" },
          { _id : 2, host : "localhost:47042" }]};
rs.initiate(config)
EOF

# now start the mongos on a standard port
mongos --port 27040 --logpath "/data/logs/mongos-1.log" --configdb "conf/localhost:47040,localhost:47041,localhost:47042" --fork
echo "Waiting 60(5) seconds for the replica sets to fully come online"
sleep 5
echo "Connnecting to mongos and enabling sharding"

# add shards and enable sharding on the test db
mongo --port 27040 <<'EOF'
db.adminCommand( { addshard : "s0/localhost:27017" } );
db.adminCommand( { addshard : "s1/localhost:37017" } );
db.adminCommand( { addshard : "s2/localhost:47017" } );
EOF
# db.trimmed.createIndex( {"Heading":"hashed" })
# db.adminCommand({enableSharding: "test"})
# db.adminCommand({shardCollection: "test.trimmed", key: {"Heading":"hashed"}});