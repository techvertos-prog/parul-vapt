FROM ubuntu:20.04

# Avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install SSH, sudo, and vim
RUN apt-get update && apt-get install -y openssh-server sudo vim && \
    mkdir /var/run/sshd

# Create user pwnme and set password
RUN useradd -rm -d /home/pwnme -s /bin/bash -g root -G sudo -u 1000 pwnme && \
    echo 'pwnme:pwnme_password' | chpasswd

# Vulnerability 1: SUID on find
RUN chmod u+s /usr/bin/find

# Vulnerability 2: Sudo without password for vim
RUN echo 'pwnme ALL=(ALL) NOPASSWD: /usr/bin/vim' >> /etc/sudoers

# SSH config to allow password auth
RUN sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config || echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
