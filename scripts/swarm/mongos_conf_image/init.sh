sleep 90

mongo s0rs0:27017 << EOF
use boat;
db.parts.createIndex({ Heading:1 });
EOF

sleep 15

mongo mongos0:27017 << EOF
db.adminCommand({ addShard: "s0/s0rs0:27017" });
db.adminCommand({ enableSharding: "boat" });
db.adminCommand({ shardCollection: "boat.parts", key: {"Heading":1}});
use config;
db.settings.save( {_id:"chunksize", value: 2} );
EOF

# db.adminCommand({ addShard: "s1/s1rs0:27017" });
# db.adminCommand({ addShard: "s2/s2rs0:27017" });