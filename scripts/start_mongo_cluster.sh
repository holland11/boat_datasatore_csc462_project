echo "if using 'sudo' to run this script, make sure to use 'sudo -E' so it gains access to the env vars"
echo "if using local=1, make sure that network mybridge is created (docker network ls"

# this script will be run on every single instance that is spawned for a mongo cluster
# make sure to change the name in the instance menu within aws
# another script will be run afterwards for setting up the config
# such as rs.initiate to initiate the replica sets, and enableSharding / addShard


if [ $LOCAL = 1 ]
then
	AWS_INSTANCE_NAME=$name
	if [ $AWS_INSTANCE_NAME = "s0rs0" ] || [ $AWS_INSTANCE_NAME = "s0rs1" ] || [ $AWS_INSTANCE_NAME = "s0rs2" ]
	then
		PORT=27017
		if [ $name = "s0rs1" ]
		then
			PORT=27018
		elif [ $name = "s0rs2" ]
		then
			PORT=27019
		fi
		docker container run -d --net=mybridge -p $PORT:$PORT --name $AWS_INSTANCE_NAME mongo --port $PORT --replSet s0 --shardsvr -smallfiles
	elif [ $AWS_INSTANCE_NAME = "s1rs0" ] || [ $AWS_INSTANCE_NAME = "s1rs1" ] || [ $AWS_INSTANCE_NAME = "s1rs2" ]
	then
		PORT=37017
		if [ $name = "s1rs1" ]
		then
			PORT=37018
		elif [ $name = "s1rs2" ]
		then
			PORT=37019
		fi
		docker container run -d --net=mybridge -p $PORT:$PORT --name $AWS_INSTANCE_NAME mongo --port $PORT --replSet s1 --shardsvr -smallfiles
	elif [ $AWS_INSTANCE_NAME = "confrs0" ] || [ $AWS_INSTANCE_NAME = "confrs1" ] || [ $AWS_INSTANCE_NAME = "confrs2" ]
	then
		PORT=47017
		if [ $name = "confrs1" ]
		then
			PORT=47018
		elif [ $name = "confrs2" ]
		then
			PORT=47019
		fi
		docker container run -d --net=mybridge -p $PORT:$PORT --name $AWS_INSTANCE_NAME mongo --port $PORT --replSet conf --configsvr -smallfiles
	else
		echo "#################################"
		echo "AWS Instance Name did not match any if statement"
		echo "#################################"
	fi
else
	# make sure in ~/.bashrc:
	#export AWS_ACCESS_KEY_ID="20 digit code"
	#export AWS_SECRET_ACCESS_KEY="40 digit code"
	#export AWS_DEFAULT_REGION="us-west-2"
	AWS_INSTANCE_ID=`curl -s http://169.254.169.254/latest/meta-data/instance-id`
	AWS_INSTANCE_NAME=`aws ec2 describe-tags --region $AWS_DEFAULT_REGION --filters "Name=resource-id,Values=$AWS_INSTANCE_ID" "Name=key,Values=Name" --output text | cut -f5`

	# maybe make this go up to like s10rs0->s10rs2 so that it can handle more shards, but doesn't require them?
	if [ $AWS_INSTANCE_NAME = "s0rs0" ] || [ $AWS_INSTANCE_NAME = "s0rs1" ] || [ $AWS_INSTANCE_NAME = "s0rs2" ]
	then
		docker container run -d -p 27017:27017 --name $AWS_INSTANCE_NAME mongo --port 27017 --replSet s0 --shardsvr --smallfiles
	elif [ $AWS_INSTANCE_NAME = "s1rs0" ] || [ $AWS_INSTANCE_NAME = "s1rs1" ] || [ $AWS_INSTANCE_NAME = "s1rs2" ]
	then
		docker container run -d -p 27017:27017 --name $AWS_INSTANCE_NAME mongo --port 27017 --replSet s1 --shardsvr --smallfiles
	elif [ $AWS_INSTANCE_NAME = "confrs0" ] || [ $AWS_INSTANCE_NAME = "confrs1" ] || [ $AWS_INSTANCE_NAME = "confrs2" ]
	then
		docker container run -d -p 27017:27017 --name $AWS_INSTANCE_NAME mongo --port 27017 --replSet conf --configsvr --smallfiles
	else
		echo "#################################"
		echo "AWS Instance Name did not match any if statement"
		echo "#################################"
	fi
fi