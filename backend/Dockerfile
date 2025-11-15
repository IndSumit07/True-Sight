# backend/Dockerfile
FROM python:3.10-slim

# Install OS-level deps needed by Pillow and some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    libtiff5-dev \
    libopenjp2-7-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Upgrade packaging tools then install requirements
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files (including models/)
# Make sure models/best.pt exists in repo under backend/models/best.pt
COPY . .

# default model path inside container
ENV MODEL_PATH=/app/models/best.pt
ENV CONF=0.25
ENV CORS_ALLOWED=*

EXPOSE 8000

# Run the FastAPI app using uvicorn (1 worker recommended for PyTorch)
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
