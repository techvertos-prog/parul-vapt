#!/bin/bash

# VAPT Workshop Master Lab Starter Script
# This script manages the entire Docker infrastructure for the 6-day training

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Determine the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DOCKER_DIR="$DIR/docker"

function show_port_map {
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${YELLOW}           VAPT Workshop - Active Lab Environment Ports         ${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo -e " | ${GREEN}Module${NC}                 | ${GREEN}Port${NC} | ${GREEN}URL / Connection Cmd${NC}"
    echo -e "----------------------------------------------------------------"
    echo -e " | XSS (DOM/Ref/Store)    | 3000 | http://localhost:3000"
    echo -e " | Privilege Escalation   | 2222 | ssh pwnme@localhost -p 2222"
    echo -e " | SQL Injection (Web)    | 8080 | http://localhost:8080/login.php"
    echo -e "${BLUE}================================================================${NC}"
    echo -e "Note: Ensure ports 3000, 2222, and 8080 are free on your host."
    echo ""
}

function start_labs {
    echo -e "${YELLOW}[*] Starting all VAPT Workshop Lab Containers...${NC}"
    cd "$DOCKER_DIR"
    docker compose up -d --build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[+] Labs successfully started in the background!${NC}"
        show_port_map
    else
        echo -e "${RED}[!] Failed to start labs. Is Docker Desktop running?${NC}"
    fi
}

function stop_labs {
    echo -e "${YELLOW}[*] Stopping and tearing down all Lab Containers...${NC}"
    cd "$DOCKER_DIR"
    docker compose down
    echo -e "${GREEN}[+] Labs successfully stopped and networks cleaned up.${NC}"
}

function stop_and_wipe_labs {
    echo -e "${RED}[*] DANGER: Completely tearing down labs and wiping all database volumes...${NC}"
    cd "$DOCKER_DIR"
    docker compose down -v
    echo -e "${GREEN}[+] Labs successfully wiped (pristine state).${NC}"
}


# CLI Menu
if [ "$1" == "start" ]; then
    start_labs
elif [ "$1" == "stop" ]; then
    stop_labs
elif [ "$1" == "wipe" ]; then
    stop_and_wipe_labs
elif [ "$1" == "status" ]; then
    show_port_map
    cd "$DOCKER_DIR"
    docker compose ps
else
    echo -e "${BLUE}VAPT Master Lab Control Script${NC}"
    echo "Usage: ./start-labs.sh {start|stop|wipe|status}"
    echo "  start  - Builds and starts all lab containers detached"
    echo "  stop   - Stops all running lab containers cleanly"
    echo "  wipe   - Stops containers AND deletes internal volumes (resets DBs)"
    echo "  status - Shows running containers and the workshop port mapping"
fi
