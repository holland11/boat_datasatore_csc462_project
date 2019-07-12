sudo -E name=s0rs0 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=s0rs1 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=s0rs2 LOCAL=1 ./start_mongo_cluster.sh

sudo -E name=s1rs0 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=s1rs1 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=s1rs2 LOCAL=1 ./start_mongo_cluster.sh

sudo -E name=confrs0 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=confrs1 LOCAL=1 ./start_mongo_cluster.sh
sudo -E name=confrs2 LOCAL=1 ./start_mongo_cluster.sh
