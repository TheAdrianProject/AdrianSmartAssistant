echo "Adrian has been stopped"
rm -f /home/pi/scube/Brain/busy.status
sudo killall php nodejs node python cu cat mpg123 play
sudo mpc stop
sudo mpc clear
sudo fuser -k 9950/tcp
sudo fuser -k 9150/tcp
#sudo alsa force-reload
 
