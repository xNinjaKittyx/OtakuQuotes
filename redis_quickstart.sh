#!/usr/bin/env sh
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
nohup redis-server &>/dev/null &
# add &>dev/null &
