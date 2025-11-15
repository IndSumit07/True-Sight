// src/App.js
import React, { useState, useRef } from "react";
import "./App.css";

function HumanReadableBBox(bbox) {
  return bbox.map((v) => Math.round(v)).join(", ");
}

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conf, setConf] = useState(0.25);
  const dropRef = useRef();

  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000/predict";

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    handleFile(f);
  };

  // drag & drop handlers
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const upload = async () => {
    if (!file) return alert("Choose an image first");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("conf", conf);

    try {
      const res = await fetch(BACKEND_URL, { method: "POST", body: form });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadAnnotated = () => {
    if (!result?.annotated_image_base64) return;
    const a = document.createElement("a");
    a.href = `data:image/jpeg;base64,${result.annotated_image_base64}`;
    a.download = "annotated.jpg";
    a.click();
  };

  return (
    <div className="app">
      <div className="header">
        <div className="brand">
          <div className="logo">O</div>
          <div className="title">
            <h1>ObjectifyAI</h1>
            <p>Safety Equipment Detector — YOLOv8</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>mAP@50</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>0.787</div>
        </div>
      </div>

      <div className="left">
        <div className="card">
          <div
            className="uploader"
            onDrop={onDrop}
            onDragOver={onDragOver}
            ref={dropRef}
            title="Click or drag an image here"
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Upload or drag & drop
            </div>
            <small>
              PNG / JPEG — model will annotate detected safety equipment.
            </small>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{ marginTop: 10 }}
            />
          </div>

          {preview && (
            <div style={{ marginTop: 12 }} className="preview">
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>Original</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>
                    {file?.name}
                  </div>
                </div>
                <img src={preview} alt="preview" />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <div className="row">
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                Confidence
              </div>
              <input
                className="range"
                type="range"
                min="0.05"
                max="0.9"
                step="0.01"
                value={conf}
                onChange={(e) => setConf(parseFloat(e.target.value))}
              />
              <div
                style={{ minWidth: 48, textAlign: "right", fontWeight: 700 }}
              >
                {conf.toFixed(2)}
              </div>
            </div>

            <div className="controls">
              <button
                className="btn secondary"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setResult(null);
                }}
              >
                Reset
              </button>
              <button
                className="btn"
                onClick={upload}
                disabled={loading || !file}
              >
                {loading ? "Processing..." : "Upload & Predict"}
              </button>
            </div>
          </div>
        </div>

        {/* results table */}
        {result && (
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>Detections</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn secondary"
                  onClick={() => setResult(null)}
                >
                  Clear
                </button>
                <button className="btn" onClick={downloadAnnotated}>
                  Download
                </button>
              </div>
            </div>

            <div className="tableWrap" style={{ marginTop: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Conf.</th>
                    <th>BBox</th>
                  </tr>
                </thead>
                <tbody>
                  {result.predictions.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ color: "var(--muted)" }}>
                        No detections
                      </td>
                    </tr>
                  )}
                  {result.predictions.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{p.class_name}</td>
                      <td>{p.confidence.toFixed(3)}</td>
                      <td>{HumanReadableBBox(p.bbox)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="right">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 700 }}>Annotated Output</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Preview</div>
          </div>

          <div className="annot-card" style={{ marginTop: 12 }}>
            {result?.annotated_image_base64 ? (
              <img
                src={`data:image/jpeg;base64,${result.annotated_image_base64}`}
                alt="annotated"
              />
            ) : (
              <div style={{ padding: 24, color: "var(--muted)" }}>
                No annotated image yet — upload & predict to see results.
              </div>
            )}

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <div className="info">
                <div style={{ fontWeight: 700 }}>
                  {result ? result.predictions.length : 0} detected
                </div>
                <small>Confidence threshold: {conf.toFixed(2)}</small>
              </div>

              <div style={{ textAlign: "right" }}>
                {result && (
                  <div className="detections">
                    {result.predictions.map((p, i) => (
                      <div className="badge" key={i}>
                        {p.class_name}{" "}
                        <span className="conf">
                          {(p.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 700 }}>About</div>
          <div style={{ color: "var(--muted)", marginTop: 8 }}>
            This demo uses a YOLOv8 model trained to detect safety equipment.
            Use a clear image for best results.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
