# backend/server.py
import os
import io
import base64
from typing import List, Dict, Any

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from PIL import Image
import numpy as np

# Ultralytics YOLO
from ultralytics import YOLO

# Environment
MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
CORS_ALLOWED = os.getenv("CORS_ALLOWED", "*")  # set to your frontend URL in prod

app = FastAPI(title="ObjectifyAI Inference API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ALLOWED] if CORS_ALLOWED != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
print(f"Loading model from: {MODEL_PATH}")
model = YOLO(MODEL_PATH)
print("Model loaded.")

class Prediction(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]  # x1,y1,x2,y2

class PredictResponse(BaseModel):
    annotated_image_base64: str
    predictions: List[Prediction]

@app.get("/")
def root():
    return {"status": "ok", "model": os.path.basename(MODEL_PATH)}

@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...), conf: float = Form(0.25)):
    # Read uploaded image bytes
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")

    # Run prediction (Ultralytics returns Results)
    # Provide confidence threshold via model.predict params
    results = model.predict(source=np.array(img), conf=conf, verbose=False)

    # We expect single image results[0]
    res = results[0]

    # Build predictions list
    preds = []
    if hasattr(res, "boxes") and res.boxes is not None:
        boxes = res.boxes.xyxy.cpu().numpy() if res.boxes.xyxy is not None else []
        confs = res.boxes.conf.cpu().numpy() if res.boxes.conf is not None else []
        clss = res.boxes.cls.cpu().numpy() if res.boxes.cls is not None else []
        names = model.model.names if hasattr(model.model, "names") else {}
        for b, c, cl in zip(boxes, confs, clss):
            x1, y1, x2, y2 = [float(v) for v in b.tolist()]
            preds.append({
                "class_name": names.get(int(cl), str(int(cl))),
                "confidence": float(c),
                "bbox": [x1, y1, x2, y2]
            })

    # Create annotated image (res.plot() returns np array)
    try:
        annotated = res.plot()  # numpy HxWx3 BGR? Ultralytics returns RGB ndarray
        # Ensure RGB -> PIL, then encode as JPEG base64
        if isinstance(annotated, np.ndarray):
            annotated_pil = Image.fromarray(annotated)
        else:
            annotated_pil = img
    except Exception:
        # fallback: return original image if plot fails
        annotated_pil = img

    buffered = io.BytesIO()
    annotated_pil.save(buffered, format="JPEG", quality=90)
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {"annotated_image_base64": img_b64, "predictions": preds}
