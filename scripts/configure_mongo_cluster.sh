echo "if using 'sudo' to run this script, make sure to use 'sudo -E' so it gains access to the env vars"

# this script will be run on one instance per shard and then the mongos router
# it executes the configuration commands to setup the shard replica sets, config replica set,
# and adds alls the shards to the mongos router

: << ENDCOMMENT
if [ $LOCAL = 1 ]
then
	AWS_INSTANCE_NAME=$name
	if [ $AWS_INSTANCE_NAME = "s0rs0" ] || [ $AWS_INSTANCE_NAME = "s0rs1" ] || [ $AWS_INSTANCE_NAME = "s0rs2" ]
	then
		mongo --port 27017 << EOF
config = { _id: "s0", members:[
		  { _id : 0, host : "localhost:27017" },
		  { _id : 1, host : "localhost:27018" },
		  { _id : 2, host : "localhost:27019" }]};
rs.initiate(config)
EOF
config = 
	elif [ $AWS_INSTANCE_NAME = "s1rs0" ] || [ $AWS_INSTANCE_NAME = "s1rs1" ] || [ $AWS_INSTANCE_NAME = "s1rs2" ]
	then
		mongo --port 37017 << EOF
config = { _id: "s1", members:[
		  { _id : 0, host : "localhost:37017" },
		  { _id : 1, host : "localhost:37018" },
		  { _id : 2, host : "localhost:37019" }]};
rs.initiate(config)
EOF
	elif [ $AWS_INSTANCE_NAME = "confrs0" ] || [ $AWS_INSTANCE_NAME = "confrs1" ] || [ $AWS_INSTANCE_NAME = "confrs2" ]
	then
		mongo --port 47017 << EOF
config = { _id: "conf", members:[
		  { _id : 0, host : "localhost:47017" },
		  { _id : 1, host : "localhost:47018" },
		  { _id : 2, host : "localhost:47019" }]};
rs.initiate(config)
EOF
	elif [ $AWS_INSTANCE_NAME = "mongos_router" ]
	then
		PORT=27040
		docker container run -d -p $PORT:27017 --entrypoint mongos mongo --configdb "conf/localhost:47017,localhost:47018,localhost:47109"
		echo "Waiting 10 seconds for the router to fully come online"
		sleep 10
		echo "Connnecting to mongos and enabling sharding"
		mongo --port $PORT <<EOF
db.adminCommand( { addshard : "s0/localhost:27017" } );
db.adminCommand( { addshard : "s1/localhost:37017" } );
db.adminCommand({enableSharding: "test"})
db.adminCommand({shardCollection: "test.trimmed", key: {"Heading":1}});
EOF
	else
		echo "#################################"
		echo "AWS Instance Name did not match any if statement"
		echo "#################################"
	fi
else
	echo "else"
fi
ENDCOMMENT

	# make sure in ~/.bashrc:
	#export AWS_ACCESS_KEY_ID="20 digit code"
	#export AWS_SECRET_ACCESS_KEY="40 digit code"
	#export AWS_DEFAULT_REGION="us-west-2"
	AWS_INSTANCE_ID=`curl -s http://169.254.169.254/latest/meta-data/instance-id`
	AWS_INSTANCE_NAME=`aws ec2 describe-tags --region $AWS_DEFAULT_REGION --filters "Name=resource-id,Values=$AWS_INSTANCE_ID" "Name=key,Values=Name" --output text | cut -f5`

	declare -A name_to_ip_map=(); while read -r a b; do name_to_ip_map["$b"]="$a"; done < <(aws ec2 describe-instances --filter "Name=instance-state-name,Values=running" --query "Reservations[].Instances[].[PublicIpAddress, Tags[?Key=='Name'].Value|[0]]" --output text)

	echo ${name_to_ip_map["s0rs0"]}

	# maybe make this go up to like s10rs0->s10rs2 so that it can handle more shards, but doesn't require them?
	if [ $AWS_INSTANCE_NAME = "s0rs0" ] || [ $AWS_INSTANCE_NAME = "s0rs1" ] || [ $AWS_INSTANCE_NAME = "s0rs2" ]
	then
		echo "Configuring s0 replica set"
		mongo --port 27017 << EOF
config = { _id: "s0", members:[
		  { _id : 0, host : "${name_to_ip_map["s0rs0"]}:27017" },
		  { _id : 1, host : "${name_to_ip_map["s0rs1"]}:27017" },
		  { _id : 2, host : "${name_to_ip_map["s0rs2"]}:27017" }]};
rs.initiate(config)
EOF
	elif [ $AWS_INSTANCE_NAME = "s1rs0" ] || [ $AWS_INSTANCE_NAME = "s1rs1" ] || [ $AWS_INSTANCE_NAME = "s1rs2" ]
	then
		echo "Configuring s0 replica set"
		mongo --port 27017 << EOF
config = { _id: "s1", members:[
		  { _id : 0, host : "${name_to_ip_map["s1rs0"]}:27017" },
		  { _id : 1, host : "${name_to_ip_map["s1rs1"]}:27017" },
		  { _id : 2, host : "${name_to_ip_map["s1rs2"]}:27017" }]};
rs.initiate(config)
EOF
	elif [ $AWS_INSTANCE_NAME = "confrs0" ] || [ $AWS_INSTANCE_NAME = "confrs1" ] || [ $AWS_INSTANCE_NAME = "confrs2" ]
	then
		echo "Configuring s0 replica set"
		mongo --port 27017 << EOF
config = { _id: "conf", members:[
		  { _id : 0, host : "${name_to_ip_map["confrs0"]}:27017" },
		  { _id : 1, host : "${name_to_ip_map["confrs1"]}:27017" },
		  { _id : 2, host : "${name_to_ip_map["confrs2"]}:27017" }]};
rs.initiate(config)
EOF
	elif [ $AWS_INSTANCE_NAME = "mongos_router" ]
	then
		mongo --port 27017 <<EOF
db.adminCommand( { addshard : "s0/${name_to_ip_map["s0rs0"]}" } );
db.adminCommand( { addshard : "s1/${name_to_ip_map["s0rs0"]}" } );
db.adminCommand( { addshard : "s2/${name_to_ip_map["s0rs0"]}" } );
db.adminCommand({enableSharding: "test"})
db.adminCommand({shardCollection: "test.trimmed", key: {"Heading":1}});
EOF
	else
		echo "#################################"
		echo "AWS Instance Name did not match any if statement"
		echo "#################################"
	fi
fi