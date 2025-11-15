#!/bin/bash
set -e

# MODEL_PATH is expected to be in repo at models/best.pt by default
echo "MODEL_PATH=$MODEL_PATH"
# Start Uvicorn with 1 worker (recommended for PyTorch/Ultralytics)
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
