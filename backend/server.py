# server.py
import os
import base64
from typing import List
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from ultralytics import YOLO

MODEL_PATH = os.environ.get("MODEL_PATH", "best.pt")
CONF_DEFAULT = float(os.environ.get("CONF", 0.25))

app = FastAPI(title="YOLOv8 FastAPI")

# Configure CORS - in production set exact origins, don't use "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ALLOWED", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model from:", MODEL_PATH)
model = YOLO(MODEL_PATH)
print("Model names:", model.names)

def draw_boxes_bgr(img_bgr, boxes, confs, classes, names):
    for (x1, y1, x2, y2), conf, cls in zip(boxes, confs, classes):
        x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
        label = f"{names[int(cls)]} {conf:.2f}"
        cv2.rectangle(img_bgr, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(img_bgr, label, (x1, max(12,y1-6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1)
    return img_bgr

@app.get("/")
def root():
    return {"status": "ok", "model": os.path.basename(MODEL_PATH)}

@app.post("/predict")
async def predict(file: UploadFile = File(...), conf: float = Form(CONF_DEFAULT)):
    content = await file.read()
    npimg = np.frombuffer(content, np.uint8)
    img_bgr = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    if img_bgr is None:
        return JSONResponse({"error": "cannot decode image"}, status_code=400)

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    results = model.predict(source=img_rgb, conf=conf, save=False, verbose=False)
    r = results[0]

    boxes, confs, classes = [], [], []
    if hasattr(r, "boxes") and r.boxes is not None:
        for box in r.boxes:
            xyxy = box.xyxy[0].tolist()
            score = float(box.conf[0])
            cls = int(box.cls[0])
            boxes.append(xyxy)
            confs.append(score)
            classes.append(cls)

    img_annot = draw_boxes_bgr(img_bgr.copy(), boxes, confs, classes, model.names)
    _, buffer = cv2.imencode(".jpg", img_annot)
    jpg_bytes = buffer.tobytes()
    jpg_b64 = base64.b64encode(jpg_bytes).decode("utf-8")

    preds = [
        {"class_id": int(c), "class_name": model.names[int(c)], "confidence": float(conf), "bbox": [float(x) for x in box]}
        for box, conf, c in zip(boxes, confs, classes)
    ]

    return JSONResponse({"predictions": preds, "annotated_image_base64": jpg_b64})
