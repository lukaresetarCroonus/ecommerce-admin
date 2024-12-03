#!/bin/bash
########################################################################################################################
#                                                        README                                                        #
#                                                                                                                      #
# Available env variables:                                                                                             #
#     PROJECT - The name of the project to use as a prefix                                                             #
#     PORT - The port to run the app on (default: 6001)                                                                #
#     SKIP_PULL - If true the latest image will not be pulled (default: false)                                         #
#                                                                                                                      #
#     DOCKER_ACCOUNT - The account to use when connecting to the Docker repository                                     #
#     DOCKER_IMAGE - The name of the docker image to pull                                                              #
#     DOCKER_PASSWORD - The optional password to use before pulling the Docker image                                   #
#                                                                                                                      #
#                                                                                                                      #
########################################################################################################################

# Exit on any command failure
set -eu
output() { [ ${TERM:-dumb} != dumb ] && tput $@ || true; }
trap 'LAST_COMMAND=${CURRENT_COMMAND=}; CURRENT_COMMAND=$BASH_COMMAND' DEBUG
trap 'ERROR_CODE=$?; FAILED_COMMAND=$LAST_COMMAND; output setaf 9; echo; echo "***"; echo "ERROR: command \"$FAILED_COMMAND\" failed with exit code $ERROR_CODE"; echo "***"; echo; output sgr0;' ERR INT TERM

# Validate that the docker is installed
if [ ! $(which docker) ]; then
    echo "ERROR: This system does not have docker installed"
    exit 10
fi
echo "### Run initiated"

# Define all composite variables that are used multiple times
REPO=$DOCKER_ACCOUNT/$DOCKER_IMAGE
SOURCE=$REPO:${IMAGE_TAG:-latest}
CONTAINER=${PROJECT:-default}-$DOCKER_IMAGE

# Pull the image
if [ ! ${SKIP_PULL:-} ]; then

    # Log into
    if [ ${DOCKER_PASSWORD:-} ]; then
        echo "### Logging into docker as $DOCKER_ACCOUNT" &>/dev/null
        docker login -u "$DOCKER_ACCOUNT" -p "$DOCKER_PASSWORD"
    fi

    echo "### Pulling image: '$SOURCE'"
    docker pull $SOURCE
fi

# Kill the previous running container with the same image name
ACTIVE_CONTAINER=$(docker ps -aqf "name=$CONTAINER")
if [[ ! -z $ACTIVE_CONTAINER ]]; then
    echo "### Removing existing: '$CONTAINER' ($ACTIVE_CONTAINER)"
    docker stop $ACTIVE_CONTAINER &>/dev/null
    docker rm $ACTIVE_CONTAINER &>/dev/null
fi

# Run the new updated image
echo "### Staring '$CONTAINER' from '$REPO' via PORT '${PORT}'"
HASH=$(docker run -d \
    -p 127.0.0.1:${PORT:-6001}:80 \
    --restart unless-stopped \
    --name $CONTAINER \
    $REPO)

# Done
echo "### Docker container started: '$HASH'"
output setaf 2 && echo && echo -n "### DONE${LOCAL_VOLUME:+" - RUNNING IN DEVELOPMENT MODE"} ###" && echo && output sgr0
