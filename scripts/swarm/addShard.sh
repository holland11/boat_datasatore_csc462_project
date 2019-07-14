

if [ shard > 0 ]
then
	# either use docker service create commands to spawn the 3 new replica sets for the shard
	# and then configure them and add the shard to the mongos instance
	# or write another docker compose file with 3 s0 replica sets
	# and then run "sed 's/ s1/ s$shard/g' compose.yml > new-shard.yml"
	# and then docker stack deploy it as long as you can do two stack deploys on top of each other
	echo "shard $shard"
else
	echo "must include shard number." 
	echo "double check in docker services ls that the shard number isn't already taken."