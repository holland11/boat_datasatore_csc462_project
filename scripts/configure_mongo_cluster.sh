# this script will be run on one instance per shard and then the mongos router
# it executes the configuration commands to setup the shard replica sets, config replica set,
# and adds alls the shards to the mongos router


# make sure in ~/.bashrc:
#export AWS_ACCESS_KEY_ID="20 digit code"
#export AWS_SECRET_ACCESS_KEY="40 digit code"
#export AWS_DEFAULT_REGION="us-west-2"
AWS_INSTANCE_ID=`curl -s http://169.254.169.254/latest/meta-data/instance-id`
AWS_INSTANCE_NAME=`aws ec2 describe-tags --filters "Name=resource-id,Values=$AWS_INSTANCE_ID" "Name=key,Values=Name" --output text | cut -f5`

declare -A name_to_ip_map=(); while read -r a b; do name_to_ip_map["$b"]="$a"; done < <(aws ec2 describe-instances --filter "Name=instance-state-name,Values=running" --query "Reservations[].Instances[].[PublicIpAddress, Tags[?Key=='Name'].Value|[0]]" --output text)

echo ${name_to_ip_map["s0rs0"]}

# maybe make this go up to like s10rs0->s10rs2 so that it can handle more shards, but doesn't require them?
if [ $AWS_INSTANCE_NAME = "s0rs0" ] || [ $AWS_INSTANCE_NAME = "s0rs1" ] || [ $AWS_INSTANCE_NAME = "s0rs2" ]
then
	#
elif [ $AWS_INSTANCE_NAME = "s1rs0" ] || [ $AWS_INSTANCE_NAME = "s1rs1" ] || [ $AWS_INSTANCE_NAME = "s1rs2" ]
then
	#
elif [ $AWS_INSTANCE_NAME = "confrs0" ] || [ $AWS_INSTANCE_NAME = "confrs1" ] || [ $AWS_INSTANCE_NAME = "confrs2" ]
then
	#
elif [ $AWS_INSTANCE_NAME = "mongos_router" ]
then
	#
else
	echo "#################################"
	echo "AWS Instance Name did not match any if statement"
	echo "#################################"
fi