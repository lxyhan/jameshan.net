---
title: 'Experiment: Painting Classifier'
pubDate: '2026-03-17'
order: 1
---

An end-to-end machine learning project: given a student's survey response describing their emotional and sensory reactions to a painting, predict which of three artworks they were looking at.

---

## The Problem

Three paintings --- *The Persistence of Memory* (Dali), *The Starry Night* (Van Gogh), and *The Water Lily Pond* (Monet) --- were shown to 533 students, each of whom filled out a detailed survey for all three. The survey captured:

- **Numerical features**: emotional intensity (1-10), count of prominent colours, count of objects noticed, estimated monetary value
- **Ordinal features** (Likert 1-5): sombreness, contentment, calmness, uneasiness
- **Free-text responses**: emotional description, associated food, associated soundtrack
- **Multi-select categorical**: room location, viewing companion, season

After cleaning (dropping incomplete responses and students with missing IDs), we had **1,599 rows** --- exactly 533 per class.

## The Pipeline

1. **Preprocessing**: z-normalization for numerics/ordinals, log-transform for the right-skewed cost feature, multi-hot encoding for categoricals, TF-IDF (top 200 tokens per text column) for free-text --- all fit only on training data
2. **Engineered features**: calmness-uneasiness gap, high-intensity binary flag, total categories selected
3. **Model comparison**: logistic regression, random forest, and MLP --- all tuned via 5-fold grouped cross-validation (grouped by student to prevent leakage)
4. **Evaluation**: macro-F1 as the primary metric, with a 70/30 train/test split accessed only once

## Results

| Model | Val Accuracy | Val Macro-F1 | Test Accuracy | Test Macro-F1 |
|---|---|---|---|---|
| Logistic Regression | 90.0% | 0.900 | --- | --- |
| Random Forest | 89.6% | 0.895 | --- | --- |
| **MLP (selected)** | **91.1%** | **0.910** | **80.2%** | **0.804** |

The MLP won with a validation macro-F1 of 0.910. All three models performed within 1.5 percentage points of each other after tuning, suggesting the feature representation matters more than model choice for this task.

The val-test gap (91.1% to 80.2%) is consistent with the small training set (~1,119 rows across 5 folds) rather than overfitting --- per-fold scores were stable (std = 0.027).

## Error Analysis

The confusion matrix revealed clear patterns:

- **The Starry Night** was easiest to classify (92.5% recall) --- its dramatic emotional character and sky/star vocabulary produce distinctive TF-IDF signals
- **The Persistence of Memory** was hardest: 51/160 test responses (31.9%) were predicted as *The Starry Night*, since both paintings evoke surreal, intense reactions
- **The Water Lily Pond** achieved the highest precision (90.7%) but 26 responses were confused with *The Starry Night*

The hardest pair to separate was Persistence of Memory vs. Starry Night --- both paintings trigger intense, somewhat unsettling emotional responses, making their text descriptions difficult to distinguish.

## Key Takeaways

- **Data leakage prevention is critical**: since each student contributed 3 rows, random splitting would leak student-specific writing style across train/test. Grouped splitting by student ID avoided this.
- **Feature engineering > model selection**: all three model families converged to similar performance once the feature pipeline was solid.
- **TF-IDF on short text is surprisingly effective**: even with informal, emoji-laden student descriptions, top-200 token TF-IDF provided strong discriminative signal.

[Full report (PDF)](/images/posts/painting-classifier/report.pdf)
