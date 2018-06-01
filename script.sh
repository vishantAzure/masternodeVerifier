#!/bin/bash

cd "/home"
echo "vst"
node_port="1337"

for pid in $(pgrep node)
do
kill -9 $pid
done && echo "[+] PIDs Killed"

sleep 1
cd /home/vishant/explorer
git pull origin master
npm start > nodeapp.log &
echo "[+] Node App Started"

## E O F ##