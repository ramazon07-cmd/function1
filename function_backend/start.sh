#!/usr/bin/env bash
set -euo pipefail
python manage.py migrate --noinput
if [ "${SEED_FUNCTION_DATA:-false}" = "true" ]; then
  python manage.py seed_function_data
fi
exec gunicorn function_backend.wsgi:application --bind "0.0.0.0:${PORT:-8000}" --workers 2 --access-logfile - --error-logfile -
