FROM ubuntu:20.04
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y vsftpd
RUN mkdir -p /var/run/vsftpd/empty
RUN mkdir -p /var/ftp

# Setup vsftpd configuration for anonymous FTP
RUN echo "listen=YES" > /etc/vsftpd.conf && \
    echo "listen_ipv6=NO" >> /etc/vsftpd.conf && \
    echo "anonymous_enable=YES" >> /etc/vsftpd.conf && \
    echo "local_enable=NO" >> /etc/vsftpd.conf && \
    echo "write_enable=NO" >> /etc/vsftpd.conf && \
    echo "anon_root=/" >> /etc/vsftpd.conf && \
    echo "no_anon_password=YES" >> /etc/vsftpd.conf && \
    echo "seccomp_sandbox=NO" >> /etc/vsftpd.conf && \
    echo "pasv_enable=YES" >> /etc/vsftpd.conf && \
    echo "pasv_min_port=21000" >> /etc/vsftpd.conf && \
    echo "pasv_max_port=21010" >> /etc/vsftpd.conf && \
    echo "pasv_address=127.0.0.1" >> /etc/vsftpd.conf

# We make /etc/shadow readable by all so anonymous user can download it
RUN chmod 644 /etc/shadow

# We will just run vsftpd in foreground
CMD ["/usr/sbin/vsftpd", "/etc/vsftpd.conf"]
