#!/bin/bash
set -e
echo "Starting server, MODEL_PATH=${MODEL_PATH:-models/best.pt}"
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
