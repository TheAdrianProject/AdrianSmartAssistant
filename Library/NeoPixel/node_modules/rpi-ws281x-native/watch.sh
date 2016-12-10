#!/bin/bash

rsync_cmd='
rsync -ruvz . \
    --exclude .git \
    --exclude .idea \
    --exclude node_modules \
    --exclude build \
    netzhimbeere:/root/src/node-rpi-ws281x-native
'
watch "${rsync_cmd}" . --wait 5
