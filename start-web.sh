#!/bin/bash
npm install
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export PORT=5000
export EXPO_METRO_WAIT_ON_URL=http://0.0.0.0:5000
npx expo start --web --port 5000
