Backend (FastAPI) for YOLOv8 inference

How to run locally:
1. Create virtualenv and install:
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt

2. Set MODEL_PATH to your best.pt (absolute or relative), then run:
   export MODEL_PATH="/full/path/to/best.pt"
   uvicorn server:app --host 0.0.0.0 --port 8000 --workers 1

Notes:
- Use --workers 1 when using GPU with PyTorch.
- In production, set CORS_ALLOWED to your frontend domain.
