#!/bin/sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Run prepopulation script
python prepopulate.py

# Collect static files (optional at runtime)
python manage.py collectstatic --noinput || true

# Start Daphne (ASGI server for WebSocket support)
exec daphne -b 0.0.0.0 -p $PORT project.asgi:application