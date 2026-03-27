# PACE: Perceptual Adaptive Contrast Enhancement

> A perception-aware image enhancement framework that improves visibility while preserving structural fidelity and natural color balance.

---

## 🔗 Links
[![Research Paper](https://img.shields.io/badge/Paper-PDF-red)](https://docs.google.com/viewer?url=https://github.com/muhammedshahid/pace-research-paper/raw/main/paper/Perceptual_Adaptive_Contrast_Enhancement_(PACE).pdf)
[![Code](https://img.shields.io/badge/Code-GitHub-black)](https://github.com/muhammedshahid/pace)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://muhammedshahid.github.io/pace/src)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19203395.svg)](https://doi.org/10.5281/zenodo.19203395)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

**PACE (Perceptual Adaptive Contrast Enhancement)** is a perception-driven image enhancement framework designed to address the limitations of conventional techniques such as Histogram Equalization (HE), CLAHE, MSRCR, and LIME.

Unlike traditional approaches that often lead to over-enhancement, noise amplification, or color distortion, PACE integrates perceptual color modeling with adaptive parameter control to achieve balanced contrast enhancement while preserving structural and visual fidelity.

It combines:

- perceptual color modeling (**Oklab**)
- adaptive parameter control based on image statistics
- structure-preserving enhancement

Result: **clearer images without over-enhancement, color distortion, or noise amplification.**

---

## 🧠 Method Overview

<p align="center">
  <img src="./src/imgs/arch.png" width="800"/>
</p>

> Figure 1: Overview of the proposed Perceptual Adaptive Contrast Enhancement (PACE) framework. The method operates in the OKLab color space and focuses on luminance-guided enhancement through two complementary pathways: (1) a global statistics-driven controller that adaptively estimates enhancement parameters, and (2) a local perceptual stream that generates spatially varying masks. Multiple enhancement cues—comprising CLAHE-based contrast modulation, Retinex-inspired illumination correction, and Laplacian-based texture amplification—are integrated via a perceptually guided blending strategy coupled with a nonlinear stability mechanism, yielding a structurally consistent and visually natural enhanced image.

PACE pipeline:

1. RGB → Oklab conversion  
2. Global feature extraction  
3. Adaptive parameter computation  
4. CLAHE-based enhancement  
5. Perceptual blending  
6. Reconstruction  

---

## 🔥 Features

- Perceptual-aware enhancement (not blind contrast stretching)
- Preserves edges, textures, and structural details
- Adaptive control using global image statistics
- Minimal color distortion (Oklab-based processing)
- Works in **Browser** and **Node.js**
- CLI tool for batch processing
- Debug pipeline with JSON export (for research)

---

## 📸 Visual Results

### Quick Demo (Input vs PACE)

<p align="center">
  <img src="./examples/output/comparison1.png" width="800"/>
</p>

> Figure 2: Visual enhancement result on a real-world portrait captured under suboptimal illumination conditions. (Left) Input image captured under poor illumination. (Right) Output produced by the proposed PACE method. The enhancement improves visibility in facial regions and clothing while preserving natural color tones and avoiding over-enhancement artifacts such as haloing and noise amplification. The result demonstrates PACE’s ability to achieve perceptually balanced contrast without degrading structural details.

### Comparative Evaluation

![comaprison 1](examples/comparison/t3.png)

> Figure 3: Chest X-ray (medical imaging). PACE delivers the most balanced and clinically useful enhancement. Lung vasculature, rib structures, and soft tissues appear sharply defined with excellent local contrast. In contrast, CLAHE and HE aggressively boost contrast, resulting in slight haloing and unnatural brightness around the mediastinum and heart region. LIME tends to darken portions of the image excessively, while MSRCR washes out fine structural details. PACE avoids these limitations and provides the highest diagnostic clarity.

For more detailed visual comparisons, see  
👉 [`examples/comparison`](./examples/comparison)

---

## 📦 Installation

### Install globally (CLI)

```bash
npm install -g pace
```

### Install locally

```bash
npm install pace
```

---

## ⚡ Quick Start

### Node.js

```js
import { applyPACE } from "pace";

// imageData: ImageData object
const output = await applyPACE(imageData);
```

---

## 🖥 CLI Usage

```bash
pace <input> <output> [options]
```

### Options

- `--debug` → Enable detailed debug logs (exports JSON)
- `--strength <value>` → Control enhancement strength (default: 1.0)
- `--config <file>` → Load JSON config for reproducibility
- `--help` → Show help
- `--version` → Show version

### Examples

```bash
pace input.jpg output.png
pace input.jpg output.png --strength 0.8
pace input.jpg output.png --debug
pace input.jpg output.png --config config.json
```

---

## ⚙️ Configuration (Advanced)

PACE supports reproducible experiments via JSON config:

```json
{
  "strength": 1.0,
  "override": {
    "controlParams": {
        "tileSize": 8,
        "clipLimit": 2.0,
        "globalAlpha": 0.7
    },
    "perceptualParams": {
        "lambda": 0.48,
        "beta": 0.33,
        "tau": 0.68,
        "edgeStabilizer": 0.05
    }
  }
}
```

### Reproducibility Note

This repository provides the full JavaScript implementation of PACE.

Comparative methods (HE, CLAHE, MSRCR, LIME) used in the paper
were implemented using Python-based libraries.

Due to cross-language differences, only PACE is included here.
However, comparison results and methodology are documented in:

- Research paper: [![Research Paper](https://img.shields.io/badge/Paper-PDF-red)](https://docs.google.com/viewer?url=https://github.com/muhammedshahid/pace-research-paper/raw/main/paper/)


### 🔹 Control Parameters

- **tileSize**  
  Defines the local region size for CLAHE-based enhancement.
  Smaller values → finer local contrast; larger values → smoother enhancement.

- **clipLimit**  
  Controls histogram clipping to prevent over-amplification.
  Higher values → stronger contrast; lower values → reduced noise amplification.

- **globalAlpha (α)**  
  Global enhancement factor derived from **contrast demand, structural confidence, and luminance imbalance**.  
  It regulates the overall strength of enhancement.
  Higher values → stronger enhancement.


### 🔹 Perceptual Parameters

- **lambda (λ) — Stability Regulator**  
  Controls nonlinear contrast compression based on **contrast strength and noise energy**.  
  Prevents unstable amplification in high-noise or high-contrast regions.

- **beta (β) — Highlight Protection**  
  Modulates enhancement in bright regions based on **luminance distribution skewness and highlight dominance**, preventing saturation and detail loss.

- **tau (τ) — Tone Limiter**  
  Limits enhancement in low-contrast regions to avoid excessive amplification and noise boosting.

- **edgeStabilizer (k) — Edge Stability Control**  
  Regulates edge enhancement stability based on noise level
  Higher noise → stronger stabilization → reduced artifacts near edges.


### 🧠 Interpretation

- **Control parameters** determine the **global and local enhancement behavior**  
- **Perceptual parameters** enforce **visual consistency and stability constraints**

Unless overridden, all parameters are **automatically estimated from global image statistics**, enabling adaptive and data-driven enhancement.

---


## 📊 Experimental Results

| Method | MSE ↓ | PSNR ↑ | SSIM ↑ | Entropy ↑ | CII ↑ | NIQE ↓ | BRISQUE ↓ | PIQE ↓ |
|--------|------|--------|--------|----------|----------|----------|----------|----------|
| HE     | 0.0500 | 15.58 | 0.6485 | 10.90 | **1.601** | 3.694 | 22.042 | 41.876 |
| CLAHE  | 0.0229 | 17.26 | 0.7611 | 13.65 | 1.282 | 3.090 | 14.688 | 34.947 |
| LIME   | 0.0510 | 13.09 | 0.7923 | **15.05** | 0.821 | **2.877** | 13.649 | **29.965** |
| MSRCR  | 0.1120 | 9.78  | 0.6573 | 13.43 | 0.399 | 3.417 | **6.792**  | 30.143 |
| **PACE** | **0.0043** | **23.93** | **0.9223** | 14.56 | 1.082 | 3.191 | 12.091 | 39.838 |

✔ PACE achieves:
- **Lowest reconstruction error (MSE)**
- **Highest reconstruction quality (PSNR)**
- **Highest structural similarity (SSIM)**
- **High richness of information/details in the image (Entropy) without introducing noise**
- **Balanced information enhancement**

---

### ⚠️ Insight: Metric Limitations

Although no-reference metrics (NIQE, BRISQUE, PIQE) are widely used:

- LIME and MSRCR often obtain **better scores**
- But produce **chromatic instability and washed-out details**

👉 This highlights a key limitation:
> Objective perceptual metrics do not always align with human visual perception.

PACE is designed to **balance perceptual quality with structural fidelity**, resulting in more stable visual outputs.

---

## 🌐 Browser Usage

PACE also works in the browser.

### 🚀 Live Demo
👉 **[Launch Interactive Demo →](./src/index.html)**

Features:

- drag & drop image
- real-time enhancement
- visual comparison

---

## 🧪 Examples

Run examples:

```bash
node examples/basic.js
node examples/with-config.js
node examples/batch.js
```

Includes:

- basic usage
- reproducible config setup
- batch processing

---

## 🧪 Testing

Run test suite:

```bash
npm test
```

Tests ensure:

- pipeline stability
- valid output ranges
- deterministic behavior
- config correctness

---

## 📊 Comparison with Existing Methods

PACE is designed to address key limitations of traditional and modern image enhancement techniques by integrating **perceptual modeling, adaptive control, and structural preservation** into a unified framework.

### 🔹 Compared Methods

- **Histogram Equalization (HE)**  
  Global contrast enhancement without spatial awareness.

- **CLAHE (Contrast Limited Adaptive Histogram Equalization)**  
  Local contrast enhancement with clipping control, but lacks perceptual guidance.

- **MSRCR (Multi-Scale Retinex with Color Restoration)**  
  Retinex-based enhancement focusing on illumination correction.

- **LIME (Low-Light Image Enhancement via Illumination Map Estimation)**  
  Illumination estimation-based enhancement, effective but prone to artifacts.

---

### ⚖️ Qualitative Comparison

| Method   | Strengths | Limitations |
|----------|----------|------------|
| **HE**   | Simple, fast | Over-enhancement, loss of local details |
| **CLAHE**| Local contrast improvement | Noise amplification, lacks global coherence |
| **MSRCR**| Illumination correction | Color distortion, halo artifacts |
| **LIME** | Good low-light visibility | Washed-out appearance, chroma inconsistency |
| **PACE (Proposed)** | Adaptive, perceptually guided, structure-preserving | Slightly higher computational cost |

---

### 🧠 Key Advantages of PACE

- **Perceptual Awareness**  
  Unlike HE/CLAHE, PACE incorporates perceptual parameters (λ, β, τ) to regulate enhancement.

- **Structure Preservation**  
  Maintains both **micro and macro structural details**, avoiding over-smoothing and artifacts.

- **Noise-Adaptive Behavior**  
  Dynamically stabilizes enhancement using noise-aware edge control.

- **Balanced Enhancement**  
  Avoids common issues such as:
  - over-saturation (HE)
  - noise amplification (CLAHE)
  - halo artifacts (MSRCR)
  - color inconsistency (LIME)

- **Unified Framework**  
  Combines:
  - histogram-based enhancement  
  - perceptual modeling  
  - adaptive blending  
  into a single pipeline

---

### 📈 Empirical Observations

Visual comparisons indicate that:

- **HE and CLAHE** often over-enhance regions and amplify noise  
- **MSRCR** introduces chromatic inconsistencies and halo effects  
- **LIME** may produce washed-out textures and unstable structures  
- **PACE**, in contrast, achieves:
  - natural color reproduction  
  - consistent contrast  
  - preserved structural fidelity  

---

### 🧪 Summary

PACE bridges the gap between **classical enhancement methods** and **perceptually-driven approaches** by introducing:

> **adaptive parameterization + perceptual constraints + structure-aware blending**

This enables it to function not only as an enhancement algorithm but also as a **reliable preprocessing component for downstream vision systems**.

---

## 📄 Research Paper

Full research details available here:

https://github.com/muhammedshahid/pace-research-paper

---

## 🎯 Applications

- General-purpose image enhancement  
- Preprocessing for computer vision and machine learning pipelines 
- Surveillance & remote sensing  
- Photography and low-light imaging  
- Medical and scientific image analysis imaging  

---

## 📁 Project Structure

```
pace/
├── src/        # core algorithm + browser demo
├── cli/        # command line interface
├── examples/   # usage examples
├── tests/      # test suite
├── package.json
├── README.md
└── LICENSE
```

---

## 📖 Citation

```bibtex
@software{pace2026,
  author = {Shahid, Mohd},
  title = {PACE: Perceptual Adaptive Contrast Enhancement},
  year = {2026},
  version = {2.0.0},
  publisher = {Zenodo},
  doi = {10.5281/zenodo.19203394},
  url = {https://doi.org/10.5281/zenodo.19203394}
}
```

---

## 📜 License

MIT License

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests.

---

## ⭐ Acknowledgment

This work builds upon foundational concepts in:

- Perceptual color spaces (Oklab)  
- Histogram-based contrast enhancement techniques  
- Image quality assessment methodologies  
- Retinex-based illumination modeling  
- Laplacian-based detail enhancement 

---

## 📬 Contact

GitHub: https://github.com/muhammedshahid
