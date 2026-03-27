# 🔁 Reproducibility: Baseline Comparisons

This directory provides scripts and instructions to reproduce baseline results used in evaluating **PACE (Perceptual Adaptive Contrast Enhancement)**.

The goal is to ensure **transparent, fair, and consistent comparison** across classical and modern image enhancement methods.

---

## 📌 Overview

The following baseline methods are included:

* **Histogram Equalization (HE)**
* **CLAHE (Contrast Limited Adaptive Histogram Equalization)**
* **MSRCR (Multi-Scale Retinex with Color Restoration)**
* **LIME (Low-Light Image Enhancement)**

All methods are applied on the **same input dataset** to ensure comparability.

---

## 📂 Directory Structure

```
reproducibility/
├── generate_baselines.py  # HE, CLAHE, MSRCR
├── run_lime.sh            # Wrapper for LIME execution
├── inputs/                # Input images
├── README.md              # This file
```

---

## ⚙️ Requirements

* Python ≥ 3.8
* OpenCV
* NumPy
* LIME dependencies (for LIME script)

Install core dependencies:

```bash
pip install opencv-python numpy
```

---

## 📥 Input Data

Provide input images as a zip file:

```
inputs.zip
```

Or place images inside:

```
reproducibility/inputs/
```

Supported formats:

* `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`

---

## ▶️ Running Baseline Methods

### 1. HE, CLAHE, MSRCR

```bash
python generate_baselines.py
```

### Output

```
enhanced_output.zip
```

Each image will generate:

```
image_HE.png
image_CLAHE.png
image_MSRCR.png
```

---

## 🌙 LIME (Official Implementation)

LIME results are generated using the original implementation:

👉 https://github.com/estija/LIME

### Run

```bash
bash run_lime.sh
```

### Command Used

```bash
python3 demo.py -f ./inputs/ -ul -l 0.15 -g 0.6
```

### Parameters

* `-ul` → illumination map refinement
* `-l 0.15` → regularization parameter
* `-g 0.6` → gamma correction

### Notes

* No modifications were made to the original LIME implementation
* Recommended/default parameters are used
* Same input dataset is used for all methods

---

## ⚖️ Methodological Notes

To ensure **fair comparison**, the following design choices are applied:

### 1. Color Space Consistency

* HE and CLAHE are applied on the **luminance channel in OKLab color space**
* This aligns with the luminance-based processing used in PACE
* If OKLab conversion fails, a fallback to **LAB color space** is used

### 2. Parameter Settings

* All baseline methods use **default or standard parameters**
* No manual tuning is performed per image

### 3. MSRCR Implementation

* Multi-scale Retinex is implemented using Gaussian scales:

  ```
  [15, 80, 250]
  ```
* Log-based normalization is applied for dynamic range compression

### 4. LIME

* Uses the **official repository implementation**
* No reimplementation or modification is introduced

---

## ⚠️ Important Disclosure

* HE and CLAHE are **not applied in RGB space**, but in **OKLab luminance space** for consistency with PACE
* This may differ from some traditional implementations
* The intent is to ensure **methodological fairness**, not to optimize baselines

---

## 🔁 Reproducibility Guarantees

This setup ensures:

* ✅ Same dataset across all methods
* ✅ Fixed parameters (no hidden tuning)
* ✅ Transparent pipelines
* ✅ Script-based batch processing
* ✅ Cross-method consistency

---

## 📌 Expected Outcome

Running all scripts will produce:

* Comparable enhanced outputs for all methods
* A unified dataset for qualitative and quantitative evaluation
* Reproducible results aligned with those reported in the paper

---

## 📚 References

* CLAHE (OpenCV implementation)
* Retinex theory (MSRCR)
* LIME: Low-Light Image Enhancement via Illumination Map Estimation

---

## 🤝 Notes for Reviewers

All scripts are provided to enable **independent verification of results**.
No proprietary tools or hidden steps are involved.

---
