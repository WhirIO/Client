#!/bin/bash

###
# This is for development & testing purposes only.
# The channel defaults to "whir"
# Runs against localhost:9000, provided this host and port are up.
# Install the server locally: https://github.com/WhirIO/Server
###

USER=$1
CHANNEL='-c whir'
UNSECURE='UNSECURE_SOCKET=true'

if [ "$USER" == "" ]; then
    echo
    echo " 💥  You need a user."
    exit 1
fi

if [ "$2" != "" ]; then
    CHANNEL="-c $2"
fi
if [ "$2" == "rand" ]; then
  CHANNEL=""
fi

if [ "$3" == "false" ]; then
    UNSECURE=''
fi

clear
eval "$UNSECURE node app/ -h localhost:9000 -u $USER $CHANNEL"
