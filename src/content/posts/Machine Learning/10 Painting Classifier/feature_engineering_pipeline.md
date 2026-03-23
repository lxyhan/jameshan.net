---
title: 'Feature Engineering Pipeline'
pubDate: '2026-03-17'
order: 2
---

A deep dive into the preprocessing pipeline behind the painting classifier --- how we turned mixed-type survey data (numbers, Likert scales, free text, multi-select categories) into a fixed-width numeric feature matrix, using only numpy and pandas.

---

## Architecture

The pipeline follows a `fit` / `transform` / `save` / `load` pattern:

```python
# Training time
prep = Preprocessor()
prep.fit(train_df)
X, y, groups = prep.transform(train_df)
prep.save("preprocessing_params.json")

# Inference time
prep = Preprocessor.load("preprocessing_params.json")
X, _, _ = prep.transform(test_df)
```

All statistics (means, standard deviations, TF-IDF vocabularies) are computed during `fit()` on training data only, then applied during `transform()`. This prevents data leakage --- the preprocessor never sees validation or test data during fitting.

## Numeric Features: Z-Normalization

Numeric columns (emotional intensity, colour count, object count) are z-normalized:

$$z = \frac{x - \mu}{\sigma}$$

The cost feature gets special treatment: it's heavily right-skewed (a few students valued paintings in the millions), so we log-transform first:

```python
log_cost = np.log1p(np.clip(cost, 0, None))
z_cost = (log_cost - mean) / std
```

`log1p` handles zero values gracefully (since $\log(1 + 0) = 0$), and clipping prevents negative values from breaking the transform.

## Ordinal Features

Likert-scale responses (Strongly Disagree = 1 through Strongly Agree = 5) are treated as continuous after z-normalization. This is a common simplification --- it assumes equal spacing between response levels, which is debatable but works well in practice for 5-point scales.

## Multi-Hot Encoding

Multi-select fields (room location, viewing companion, season) are encoded as binary vectors. If a student selected "Winter" and "Fall" for season:

```
[Spring=0, Summer=0, Fall=1, Winter=1]
```

The vocabulary is learned during `fit()` (sorted set of all categories seen in training data), so unseen categories at inference time are simply ignored.

```python
def _fit_multi_hot(self, df):
    vocab = {}
    for col in MULTI_SELECT_COLS:
        cats = set()
        for val in df[col].values:
            cats.update(_parse_multi_select(val))
        vocab[col] = sorted(cats)
    self.params["multi_hot_vocab"] = vocab
```

## TF-IDF from Scratch

The three free-text columns (emotional description, food association, soundtrack association) are vectorized using TF-IDF with a vocabulary cap of 200 tokens per column, yielding a $200 \times 3 = 600$-dimensional sparse block.

The implementation:

1. **Tokenize**: lowercase, strip non-alphanumeric characters, split on whitespace
2. **Document frequency**: count how many responses contain each token
3. **Select top-k**: keep the 200 most frequent tokens as the vocabulary
4. **Compute TF-IDF**: for each response, $\text{TF-IDF}(t, d) = \frac{\text{count}(t, d)}{|d|} \times \text{IDF}(t)$
5. **L2-normalize** each row so response length doesn't dominate

The IDF formula uses smoothing to prevent division by zero:

$$\text{IDF}(t) = \log\frac{1 + N}{1 + \text{df}(t)} + 1$$

```python
def _fit_tfidf(self, df):
    for col in TEXT_COLS:
        texts = df[col].fillna("").astype(str).tolist()
        tokenized = [_tokenize(t) for t in texts]
        n_docs = len(tokenized)

        doc_freq = Counter()
        for tokens in tokenized:
            for t in set(tokens):  # set() avoids double-counting
                doc_freq[t] += 1

        top = doc_freq.most_common(MAX_TFIDF_FEATURES)
        word2idx = {w: i for i, (w, _) in enumerate(top)}

        idf = np.zeros(len(word2idx))
        for w, i in word2idx.items():
            idf[i] = math.log((1 + n_docs) / (1 + doc_freq[w])) + 1.0
```

Why no pre-trained embeddings? The survey responses are short, informal, and emoji-heavy --- domain-specific TF-IDF on the actual vocabulary turned out to be more discriminative than generic embeddings would be.

## Engineered Features

TODO(human)

## Serialization

The entire preprocessor state serializes to a single JSON file (`preprocessing_params.json`), containing:
- Imputation values (medians for numerics, modes for ordinals)
- Multi-hot vocabularies
- TF-IDF vocabularies and IDF vectors
- Z-normalization statistics (mean/std per feature)

This means the inference script (`pred.py`) can reconstruct the exact same preprocessing pipeline with zero sklearn dependency --- just numpy, pandas, and the JSON file.
