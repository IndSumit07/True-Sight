# 🔥 TrueSight — AI-Based Safety Equipment Detection  
### **YOLOv8 + FastAPI + React | Full Stack Computer Vision System**

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![Framework](https://img.shields.io/badge/Framework-FastAPI-teal)
![Model](https://img.shields.io/badge/Model-YOLOv8s-orange)
![Frontend](https://img.shields.io/badge/Frontend-ReactJS-blue)

---

## 🚀 Overview

**TrueSight** is an AI-powered computer vision system designed to detect **safety equipment** in images.  
It uses a custom-trained **YOLOv8s model**, a **FastAPI backend**, and a beautiful **React web interface**.

This project was built for the **HackBeyond Hackathon 2025**.

---

## 🎯 Features

- ✔ Detect 7 safety equipment classes  
- ✔ Real-time image upload & prediction  
- ✔ Annotated image returned (Base64)  
- ✔ MERN-style frontend (React + API backend)  
- ✔ Fully Dockerized backend for smooth deployment  
- ✔ mAP50 score: **0.78**  
- ✔ Simple & fast REST API for integration  

---

## 🧠 Model Details

### **Model Used:** YOLOv8s  
### **7 Classes:**  
- Oxygen Tank  
- Nitrogen Tank  
- First Aid Box  
- Fire Alarm  
- Safety Switch Panel  
- Emergency Phone  
- Fire Extinguisher  

### **Training Stats**
| Metric | Value |
|--------|--------|
| Epochs | 50 |
| mAP50 | **0.787** |
| mAP50-95 | **0.661** |
| Precision | **0.90** |
| Recall | **0.72** |

### **Confidence Threshold**
We use:

```
0.25 (25%)
```

To eliminate low-confidence predictions and reduce false positives.

---

## 📁 Project Structure

```
TrueSight/
│
├── backend/
│   ├── server.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── models/
│   │    └── best.pt
│   └── utils/
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── styles.css
    ├── public/
    └── package.json
```

---

## 🖥️ Live Demo (For Judges)
👉 **Frontend URL:** *ADD YOUR DEPLOYED LINK HERE*  
👉 **Backend URL:** *ADD RENDER BACKEND API URL HERE*  

---

## 📸 Sample Predictions  
> *(Replace with your screenshots)*

### **Input**
![Input Image](assets/input.jpg)

### **Output**
![Output Image](assets/output.jpg)

---

# 🧪 API Documentation

## **POST /predict**
Upload an image → get back annotated image + detections.

### **Request**
```
POST /predict
Content-Type: multipart/form-data
file: image.jpg
conf: 0.25
```

### Example (PowerShell)
```powershell
curl.exe -X POST "https://your-backend-url.com/predict" `
     -F "file=@C:\Users\image.jpg" `
     -F "conf=0.25"
```

### **Response**
```json
{
  "predictions": [
    {
      "class_name": "FireExtinguisher",
      "confidence": 0.82,
      "bbox": [132, 88, 210, 260]
    }
  ],
  "annotated_image_base64": "..."
}
```

---

# 🐳 Backend Setup (Local)

### Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Run server
```bash
uvicorn server:app --reload
```

---

# 🐳 Backend Docker Deployment

### **Dockerfile**

```dockerfile
FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libjpeg-dev zlib1g-dev libpng-dev libtiff5-dev \
    libopenjp2-7-dev libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV MODEL_PATH=/app/models/best.pt
ENV PORT=8000

EXPOSE 8000

CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
```

### Build locally
```bash
docker build -t truesight-backend .
```

### Run locally
```bash
docker run -p 8000:8000 truesight-backend
```

---

# 🌐 Frontend Setup (React)

### Install dependencies:
```bash
cd frontend
npm install
```

### Run Dev Server:
```bash
npm run dev
```

---

# 🚀 Deployment

### Backend:
- Dockerized  
- Runs perfectly on **Render**  
- Uses model stored inside the container  

### Frontend:
- Works on:
  - **Vercel**
  - **Netlify**
  - **GitHub Pages**

---

# 🧾 Hackathon Submission Summary

| Submission Item | Status |
|------------------|--------|
| Model trained | ✔ Done |
| mAP50 score | **0.78** |
| best.pt | ✔ Provided |
| Working web app | ✔ Deployed |
| GitHub repository | ✔ Public |
| Slides / PPT | ✔ Attached |
| Demo video (optional) | Pending |

---

# 👥 Team Members

| Name | Role |
|------|------|
| **Sumit Kumar** | Full Stack, Model Training & Deployment |
| **Member 2** | Frontend Developer |
| **Member 3** | Dataset Prep & QA |

*(Edit names as needed)*

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 🙏 Acknowledgements

- Ultralytics YOLOv8  
- FastAPI Community  
- ReactJS Community  
- HackBeyond Hackathon  

---

# ⭐ If you like this project  
Give the repo a **star ⭐ on GitHub**!
