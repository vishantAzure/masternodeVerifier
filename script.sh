#!/bin/bash

for pid in $(pgrep node)
do
kill -9 $pid
done && echo "[+] PIDs Killed"

cd /home/explorer
git pull origin master
sleep 1
npm start
echo "[+] Node App Started"

## E O F ##