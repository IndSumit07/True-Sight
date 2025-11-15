Hackathon Submission - Round 1
Timestamp: 20251114-073017

Team / Author: [Your Name or Team]
Model: YOLOv8 (fine-tuned)
Best weights: best.pt
Validation mAP@0.5: 0.786726  (use 0.787 for the form)
Files included:
 - best.pt
 - last.pt (if present)
 - results.png (if present)
 - results.csv (if present)
 - data.yaml (if present)
Notes:
 - Trained on dataset 'hackathon2_train_1' (see data.yaml).
 - Validation command used: model = YOLO('best.pt'); model.val(data='data.yaml')
