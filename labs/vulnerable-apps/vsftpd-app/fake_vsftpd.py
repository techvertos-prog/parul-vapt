import socket
import threading
import subprocess
import time

def handle_ftp_client(conn, addr):
    conn.sendall(b"220 (vsFTPd 2.3.4)\r\n")
    try:
        data = conn.recv(1024).decode('utf-8', 'ignore')
        if data.upper().startswith("USER "):
            conn.sendall(b"331 Please specify the password.\r\n")
            
            # The famous smiley face backdoor trigger
            if ":)" in data:
                print(f"[+] Backdoor triggered by {addr[0]}")
                threading.Thread(target=start_backdoor, daemon=True).start()
                
            data = conn.recv(1024).decode('utf-8', 'ignore')
            conn.sendall(b"530 Login incorrect.\r\n")
            time.sleep(10) # Hold connection open while exploit runs
    except Exception as e:
        print(f"Error handling FTP client: {e}")
    finally:
        conn.close()

def start_backdoor():
    print("[*] Spawning bind shell on port 6200...")
    # Use busybox netcat to bind a shell to port 6200
    subprocess.run(["nc", "-l", "-p", "6200", "-e", "/bin/sh"])

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('0.0.0.0', 21))
    s.listen(5)
    print("Vulnerable vsftpd 2.3.4 simulator listening on port 21...")
    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_ftp_client, args=(conn, addr), daemon=True).start()

if __name__ == "__main__":
    main()
