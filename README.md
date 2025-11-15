# 🔥 TrueSight — AI-Based Safety Equipment Detection  
### **YOLOv8 + FastAPI + React | Full Stack Computer Vision System**

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

# Use Our Webapp

---

# 🐳 Backend Setup (Local)

### Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Run server
```bash
.\.venv\Scripts\Activate
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --workers 1
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
npm start
```

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


# 🙏 Acknowledgements

- Ultralytics YOLOv8  
- FastAPI Community  
- ReactJS Community  
- HackBeyond Hackathon  

---

# ⭐ If you like this project  
Give the repo a **star ⭐ on GitHub**!
