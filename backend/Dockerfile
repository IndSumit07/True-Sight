# backend/Dockerfile
FROM python:3.10-slim

# Install OS-level deps needed by Pillow, OpenCV and other libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    libtiff5-dev \
    libopenjp2-7-dev \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and upgrade pip tooling first for reliable wheel installs
COPY requirements.txt .

RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app including models/
COPY . .

# Ensure Render's PORT env gets used; set sensible defaults
ENV MODEL_PATH=/app/models/best.pt
ENV CONF=0.25
ENV CORS_ALLOWED=*
ENV PORT=8000

EXPOSE 8000

# Use shell form so we can interpolate the PORT env var Render sets
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
