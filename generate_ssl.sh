#!/bin/bash

CERT_DIR="./certs"

mkdir -p $CERT_DIR

echo "Generating SSL certificate for domain: $PUBLIC_IP"
echo "Saving to: $CERT_DIR"

openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout $CERT_DIR/privkey.pem \
  -out $CERT_DIR/fullchain.pem \
  -days 365 \
  -subj "/C=US/ST=State/L=City/O=Organization"

echo "Done!"
echo "Generated:"
echo " - $CERT_DIR/privkey.pem"
echo " - $CERT_DIR/fullchain.pem"
