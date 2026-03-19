# VAPT Workshop

Welcome to the VAPT (Vulnerability Assessment and Penetration Testing) Workshop repository. This repository contains vulnerable applications and lab environments used for training.

## Prerequisites

- **Docker** and **Docker Compose** must be installed and running.
- **Python 3** is required if you want to run the dynamic lab UI.
- Ensure the following ports are free on your host:
  - `8778` (Workshop Main UI)
  - `3000` (XSS Lab)
  - `2222` (Privilege Escalation Lab)
  - `8080` (SQL Injection Lab)

## Usage Instructions

There are two primary ways to run and interact with the workshop labs: using the Dynamic Web UI or via the Command Line.

### 1. Using the Dynamic Web UI (Recommended)

The workshop includes a web interface to start, stop, and view logs for different lab modules dynamically.

To start the server, open a terminal in the root of the repository and run:
```bash
python3 workshop_server.py
```
> **Note:** The server depends on Python 3 and runs on port `8778` by default.

Then, open your browser and navigate to: http://localhost:8778

### 2. Using the Command Line Script

You can also manage the lab containers directly using the provided bash script.

Navigate to the repository root, then run:

```bash
./labs/start-labs.sh start
```

#### Available CLI Commands:

- `start`  - Builds and starts all lab containers detached.
- `stop`   - Stops all running lab containers cleanly.
- `wipe`   - Stops containers AND deletes internal volumes (resets databases to pristine state).
- `status` - Shows running containers and the workshop port mapping.

Example to check status:
```bash
./labs/start-labs.sh status
```

## Lab Access Ports
Once started, the individual labs are accessible at:
- **XSS (DOM/Ref/Store):** `http://localhost:3000`
- **SQL Injection (Web):** `http://localhost:8080/login.php`
- **Privilege Escalation:** `ssh pwnme@localhost -p 2222`
