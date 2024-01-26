#!/bin/bash

rsync -avzhP --exclude='node_modules' --delete --rsh='ssh -p 2112' ~/Developer/flutter-assistant/ root@156.236.31.192:~/flutter-assistant

ssh root@156.236.31.192 -p 2112 '
cd flutter-assistant/deploy-files;
docker compose down flutter-assistant-node-app;
export CLOUDFLARE_TOKEN=aZtL_5WDeJeNcw_XX4m_zHXmjmfCdqUIFDakNGmA;
export SSH_PRIVATE_KEY_PASSPHRASE=loveflutter;
export OPENAI_API_KEY=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;
docker compose up -d --build;
docker compose logs flutter-assistant-node-app -f;';