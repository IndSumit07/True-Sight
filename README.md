ObjectifyAI - YOLOv8 Webapp (Backend + Frontend)

Repository layout:
- backend/: FastAPI server (loads best.pt)
- frontend/: React app (upload -> /predict)

Quickstart (dev):
1. Place your trained model best.pt into backend/models/ (create folder).
2. Backend:
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   export MODEL_PATH="/full/path/to/backend/models/best.pt"
   uvicorn server:app --host 0.0.0.0 --port 8000 --workers 1

3. Frontend:
   cd frontend
   npm install
   export REACT_APP_API_URL="http://localhost:8000/predict"  # optional
   npm start

4. Visit http://localhost:3000

Docker (optional):
- Edit docker-compose.yml and mount your model into ./backend/models/best.pt
- Run: docker-compose up --build

Notes:
- Use --workers 1 when using GPU.
- In production, set CORS_ALLOWED to your frontend domain.
