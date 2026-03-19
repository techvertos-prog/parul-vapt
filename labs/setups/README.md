# Setup Guide for VAPT Labs

This directory contains the configurations needed to spin up local, safe targets for the workshop's hands-on components.

## Prerequisites
- Docker Engine installed (`docker`)
- Docker Compose installed (`docker-compose`)

## Starting a Lab

### XSS Lab (Reflected & Stored XSS)
```bash
cd docker/
docker-compose -f xss-docker-compose.yml up -d
```
Access the application at `http://localhost:3000`

### SQL Injection Lab (Auth Bypass)
```bash
cd docker/
docker-compose -f sqli-docker-compose.yml up -d
```
Access the application at `http://localhost:8080`

## Stopping Labs
To conserve system resources, remember to tear down labs when finishing a module.
```bash
docker-compose -f <lab-file.yml> down
```
