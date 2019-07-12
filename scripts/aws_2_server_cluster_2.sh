node1=172.31.16.113
node2=172.31.21.63

docker container run -d -p 27017:27017 --name s0rs2 mongo --port 27017 --replSet s0 --shardsvr --smallfiles

docker container run -d -p 37017:27017 --name s1rs2 mongo --port 27017 --replSet s1 --shardsvr --smallfiles

docker container run -d -p 47017:27017 --name confrs2 mongo --port 27017 --replSet conf --configsvr --smallfiles

wait 5

mongo --port 27017 << EOF
config = { _id: "s0", members:[
		  { _id : 0, host : "$node1:27017" },
		  { _id : 1, host : "$node1:27018" },
		  { _id : 2, host : "$node2:27017" }]};
rs.initiate(config)
EOF

mongo --port 37017 << EOF
config = { _id: "s1", members:[
		  { _id : 0, host : "$node1:37017" },
		  { _id : 1, host : "$node1:37018" },
		  { _id : 2, host : "$node2:37017" }]};
rs.initiate(config)
EOF

mongo --port 47017 << EOF
config = { _id: "conf", members:[
		  { _id : 0, host : "$node1:47017" },
		  { _id : 1, host : "$node1:47018" },
		  { _id : 2, host : "$node2:47017" }]};
rs.initiate(config)
EOF


wait 5

docker container run -d -p 27040:27017 --name router0 --entrypoint mongos mongo --port 27040 --configdb "conf/$node1:47017,$node1:47018,$node2:47017"

wait 5

mongo --port 27040 <<'EOF'
db.adminCommand( { addshard : "s0/localhost:27017" } );
db.adminCommand( { addshard : "s1/localhost:37017" } );
db.adminCommand( { addshard : "s2/localhost:47017" } );
db.adminCommand( { enableSharding : "sharded" } );
db.adminCommand( { shardCollection : "sharded_collec", key : {"Heading":1} } );
EOF

echo "done"