FROM alpine:3.19

# Install essential tools for CTF challenges
RUN apk add --no-cache \
    bash \
    coreutils \
    findutils \
    grep \
    less \
    file

# Create baker user with home directory
RUN adduser -D -s /bin/bash -h /home/baker baker && \
    echo "baker:baker" | chpasswd

# Copy filesystem structure
COPY filesystem/ /

# Set up permissions for challenges
RUN chown -R baker:baker /home/baker && \
    chmod 700 /home/baker/.secret_recipe && \
    chmod 644 /home/baker/notes.txt && \
    chmod 644 /home/baker/.bashrc && \
    chmod 644 /home/baker/.profile && \
    chmod -R 755 /home/baker/orders && \
    chmod -R 755 /home/baker/messages

WORKDIR /home/baker
USER baker

ENV TERM=xterm-256color
ENV HOME=/home/baker

CMD ["/bin/bash", "-l"]
