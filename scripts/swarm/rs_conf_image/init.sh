sleep 25
mongo ${shard}rs0:27017 << EOF
config = { _id: "$shard", members: [
    { _id: 0, host: "${shard}rs0" },
    { _id: 1, host: "${shard}rs1" },
    { _id: 2, host: "${shard}rs2", arbiterOnly: true }]};
rs.initiate(config)
EOF