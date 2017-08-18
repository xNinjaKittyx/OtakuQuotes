#!/usr/bin/env sh
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
no-hup redis-server
# add &>dev/null &
