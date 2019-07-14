if [ $shard -gt 0 ]
then
	test=$(docker service ls | grep s${shard}rs0)
	if [ -z "$test" ]
	then
		sed "s/s%@/s${shard}/g" add-shard-template.yml > add-shard.yml
		docker stack deploy -c add-shard.yml cluster
		rm add-shard.yml
		echo "adding shard $shard"
	else
		echo "shard number provided already exists in 'docker service ls'"
	fi
else
	echo "must include shard number." 
	echo "double check in 'docker services ls' that the shard number isn't already taken."
	echo "usage: '$ shard=1 ./addShard.sh'"
fi