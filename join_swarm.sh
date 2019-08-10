#!/bin/bash
USERNAME=ubuntu
HOSTS="18.237.75.254 54.201.252.78 54.213.53.253"
SCRIPT="sudo docker swarm join --token SWMTKN-1-49k7ot0vrp17g71d7wul2405e5wozu1kqz1tvtl2ytop8rlahx-anvi7pqdk4m25su9np8ntlpii 172.31.18.197:2377"
for HOSTNAME in ${HOSTS} ; do
    ssh -i /mnt/c/Users/Patrick/Dropbox/code/.ssh/aws_ssh_key_1.pem -o StrictHostKeyChecking=no -l ${USERNAME} ${HOSTNAME} "${SCRIPT}"
done