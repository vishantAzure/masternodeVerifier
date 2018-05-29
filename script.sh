#!/bin/bash

cd "/home"
echo "vst"
node_port="1337"

listening="`lsof -i:$node_port`"

for pid in $(ps aux | grep supervisor | awk '{print $2}')
do
kill -9 $pid &> /dev/null
done && echo "[+] PIDs Killed"
kill -9 $(lsof -i:$node_port |awk '{print $2}') &> /dev/null

sleep 1
if [ -z "$listening" ] ; then
    cd /home/explorer/
    git pull origin master
    npm start > nodeapp.log &
    echo "[+] Node App Started"
else
    echo "[+] Node App Already Running"
fi

## E O F ##