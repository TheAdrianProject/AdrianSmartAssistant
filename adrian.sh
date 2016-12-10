# adrian.sh

blue=`tput setaf 4`
green=`tput setaf 2`
reset=`tput sgr0`
echo "${blue}[------------------------------------ ADRIAN APP START ------------------------------------] ${reset}"

# Free up listerner port
sudo fuser -k 9950/tcp
sudo fuser -k 9150/tcp

# Truncating app log files
truncate -s 0 queue.json
truncate -s 0 Modules/Listener/Log/lastSentense.json

# Start Adrian App 
sudo node index.js &

# Start Google Speech Recognintion Deamon
sudo node Library/googleSpeech/stream.js  &

# Start Neopixel Deamon
sudo node Library/NeoPixel/blueAsteroid.js 




