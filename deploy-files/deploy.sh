#!/bin/bash

rsync -avzhP --exclude='node_modules' --delete --rsh='ssh -p 2112' ~/Developer/flutter-assistant/ root@156.236.31.192:~/flutter-assistant

ssh root@156.236.31.192 -p 2112 'cd flutter-assistant/deploy-files; docker compose down flutter-assistant-node-app; docker compose up -d --build; docker compose logs flutter-assistant-node-app -f;';