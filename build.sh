#!/bin/sh
VERSION=`cat VERSION`
IMAGE_NAME=docker.pkg.github.com/alferguet/note-app-backend/production
docker build -t $IMAGE_NAME:$VERSION . && docker push $IMAGE_NAME:$VERSION
