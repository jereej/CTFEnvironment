#!/bin/sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Run prepopulation script
python prepopulation.py

# Collect static files (optional at runtime)
python manage.py collectstatic --noinput || true

# Start Gunicorn
exec gunicorn project.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 4 \
    --timeout 120 \
    --keep-alive 120 \
    --access-logfile - \
    --error-logfile -