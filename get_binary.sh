ARCH=$(uname -m)
FILENAME="ookla-speedtest-1.2.0-linux-$ARCH.tgz"

wget https://install.speedtest.net/app/cli/$FILENAME
tar -xvf $FILENAME
rm $FILENAME
mv speedtest /usr/local/bin/speedtest