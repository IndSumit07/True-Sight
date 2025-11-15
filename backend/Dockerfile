FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .
ENV MODEL_PATH="C:\\Users\\devel\\OneDrive\\Desktop\\TrueSight\\backend\\models\\best.pt"
ENV CONF=0.25
ENV CORS_ALLOWED=*
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
