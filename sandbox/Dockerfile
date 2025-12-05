FROM alpine:3.19

# Install essential tools for CTF challenges
RUN apk add --no-cache \
    bash \
    coreutils \
    findutils \
    grep \
    sed \
    gawk \
    less \
    vim \
    nano \
    file \
    tree \
    sqlite \
    openssl \
    xxd \
    tar \
    gzip \
    sudo

# Create baker user with home directory
RUN adduser -D -s /bin/bash -h /home/baker baker && \
    echo "baker:baker" | chpasswd

# Copy filesystem structure
COPY filesystem/ /

# Copy scripts
COPY scripts/ /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh 2>/dev/null || true

# Create SQLite database from SQL file
RUN sqlite3 /opt/bakery/inventory.db < /opt/bakery/init_db.sql && \
    rm /opt/bakery/init_db.sql

# Create backup archive with hidden flag
RUN mkdir -p /tmp/backup_content && \
    echo "Old orders backup from November 2024" > /tmp/backup_content/readme.txt && \
    echo "BAGUETTE{archive_forensics_expert}" > /tmp/backup_content/.hidden_flag && \
    tar -czf /opt/bakery/backup_nov2024.tar.gz -C /tmp/backup_content . && \
    rm -rf /tmp/backup_content

# Set up permissions for challenges
RUN chown -R baker:baker /home/baker && \
    chmod 700 /home/baker/.secret_recipe && \
    chmod 644 /home/baker/notes.txt && \
    chmod 644 /home/baker/.bashrc && \
    chmod 644 /home/baker/.profile && \
    chmod -R 755 /home/baker/orders && \
    chmod -R 755 /home/baker/messages && \
    # Log files readable but owned by root
    chmod 644 /var/log/*.log && \
    # Root secret for privilege escalation challenge
    chmod 600 /root/flag.txt && \
    # Make the backup tool SUID for privilege escalation challenge
    chown root:root /usr/local/bin/backup_tool.sh && \
    chmod 4755 /usr/local/bin/backup_tool.sh && \
    # Database and archive permissions
    chmod 644 /opt/bakery/inventory.db && \
    chmod 644 /opt/bakery/backup_nov2024.tar.gz

WORKDIR /home/baker
USER baker

ENV TERM=xterm-256color
ENV HOME=/home/baker

CMD ["/bin/bash", "-l"]
