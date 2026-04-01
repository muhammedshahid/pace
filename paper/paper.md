# PACE: A Feature-Driven Adaptive Contrast Enhancement Framework for Structure-Preserving Image Processing

## Abstract
Contrast enhancement is a fundamental preprocessing step in image analysis, yet existing methods often introduce artifacts such as over-enhancement, noise amplification, and structural distortion. This paper presents **Perceptual Adaptive Contrast Enhancement (PACE)**, a feature-driven framework designed to achieve stable and structure-preserving contrast improvement across diverse imaging conditions.

PACE operates in the perceptually uniform OKLab color space and integrates complementary enhancement signals, including CLAHE-based local contrast, Retinex-inspired reflectance estimation, and Laplacian-based texture enhancement. A key component is an adaptive parameter controller that derives enhancement parameters from global image statistics, enabling content-aware processing without manual tuning. A nonlinear stability regulator is incorporated to suppress excessive amplification and improve robustness.

The method is implemented as a modular software system supporting browser, Node.js, and command-line environments. Experimental evaluation demonstrates that PACE achieves a consistent balance between contrast enhancement and structural fidelity. The software is lightweight, reproducible, and suitable for integration into image processing and computer vision pipelines.

## Keywords
Image enhancement; contrast enhancement; adaptive processing; CLAHE; Retinex; perceptual image processing; OKLab

## 1. Introduction
Contrast enhancement is widely used to improve perceptual visibility and to support downstream image analysis tasks. Classical methods such as Histogram Equalization (HE) and Contrast Limited Adaptive Histogram Equalization (CLAHE) provide effective contrast amplification but often produce undesirable artifacts, including noise amplification, halo effects, and loss of structural consistency.

Retinex-based approaches improve dynamic range under non-uniform illumination but typically require careful parameter tuning and may introduce instability across varying image conditions. Learning-based methods offer improved performance but introduce additional complexity, data dependency, and reduced interpretability.

A key limitation across these approaches is the lack of robust adaptation to image-specific characteristics such as luminance distribution, structural complexity, and noise level. Fixed or weakly adaptive parameterizations often lead to inconsistent enhancement quality.

To address these limitations, this work presents **PACE**, a feature-driven contrast enhancement framework that integrates multiple enhancement signals within an adaptive control mechanism. The proposed method is designed as a reusable and reproducible software system, enabling consistent performance across diverse image types while maintaining computational efficiency.

## 2. Software Description

### 2.1 Software Architecture
PACE is implemented as a modular and extensible software system to support reproducibility and multi-environment deployment.

The repository is structured into the following components:

- Core module (`src/`): Implements feature extraction, adaptive parameter estimation, and enhancement logic  
- Distribution builds (`dist/`): Provides optimized builds (ESM, CommonJS, CDN)  
- Command-line interface (`cli/`): Enables batch processing  
- Reproducibility module (`reproducibility/`): Benchmarking scripts  

The software supports browser, Node.js, and CLI workflows.

### 2.2 Functional Description
PACE enhances image luminance through a feature-driven pipeline:

1. Feature Extraction  
2. Adaptive Parameter Estimation  
3. Multi-Signal Enhancement (CLAHE, Retinex, Laplacian)  
4. Perceptual Blending and Stabilization

# 3. Methodology

PACE operates as a structured **global-to-local adaptive enhancement pipeline**, integrating statistical feature extraction, parameter inference, spatial modulation, and perceptual multi-signal blending.

---

## 3.1 Pipeline Overview

The pipeline consists of four sequential stages:

1. **Global feature extraction**  
2. **Adaptive parameter computation**  
3. **Local strength modulation**  
4. **Multi-signal adaptive blending**

---

## 3.2 Distribution Features

Let \( L = \{L_i\}_{i=1}^{N} \) denote luminance values.

**Mean**
```math
\mu = \frac{1}{N} \sum_{i=1}^{N} L_i
```

**Variance**
```math
\sigma^2 = \max\left(0,\; \frac{1}{N} \sum L_i^2 - \mu^2 \right)
```

**Standard Deviation**
```math
\sigma = \sqrt{\sigma^2}
```

**Skewness**
```math
\text{Skewness} = \frac{1}{N (\sigma + \epsilon)^3} \sum (L_i - \mu)^3
```

**Kurtosis**
```math
\text{Kurtosis} = \frac{1}{N (\sigma + \epsilon)^4} \sum (L_i - \mu)^4
```

**Entropy**
```math
H = - \sum p_k \log_2(p_k + \epsilon)
```

**Normalized Entropy**
```math
H_{norm} = \frac{H}{\log_2 K}
```

**Dynamic Range**
```math
D = P_{95} - P_{5}
```

**Shadow Ratio**
```math
R_s = \frac{1}{N} \sum \mathbf{{1}}(L_i < 0.2)
```

**Highlight Ratio**
```math
R_h = \frac{1}{N} \sum \mathbf{{1}}(L_i > 0.8)
```

---

## 3.3 Adaptive Parameter Computation

```math
C_{need} = (1 - H_{norm})(1 - D)
```

```math
S_{conf} = \frac{E_d}{1 + N_r}
```

```math
I_{imb} = |R_s - R_h|
```

```math
\alpha = \frac{0.5 I_{imb} + 0.3 C_{need} + 0.4 S_{conf}}{0.5 + 0.5 I_{imb} + 0.3 C_{need} + 0.4 S_{conf}}
```

---

## 3.4 Local Adaptive Strength

```math
G = \max(|g_x|,|g_y|) + 0.25 \min(|g_x|,|g_y|)
```

```math
S = \frac{\mu_G \cdot C}{1 + N_l}
```

```math
\alpha(x,y) = \mathrm{{clip}}(\alpha [1 + 1.2(C_{{loc}}-0.5)], 0.05, 2\alpha)
```

---

## 3.5 Multi-Signal Blending

```math
\alpha' = \alpha (0.8 + 0.8 \alpha_{{map}})
```

```math
R = \log(L_{{small}}) - \log(L_{{medium}})
```

```math
\Delta = \Delta_c + \eta \cdot \Delta_d \cdot M_d \cdot M_s \cdot M_e
```

```math
L_{{enh}} = \mathrm{{clip}}(L + \Delta' \cdot G_e \cdot M_l \cdot G_c, 0, 1)
```

---

## 3.6 Algorithm

**Algorithm 1: PACE Enhancement**

**Input:** RGB image \( I \)  
**Output:** Enhanced image \( I_{{enh}} \)

1. Convert \( I \) to OKLab and extract luminance \( L \)  
2. Compute global distribution features  
3. Estimate adaptive parameters  
4. Apply CLAHE for base enhancement  
5. Compute spatially adaptive strength map  
6. Apply multi-signal blending  
7. Reconstruct enhanced RGB image  

**Return:** \( I_{{enh}} \)

## 4. Illustrative Examples

Qualitative comparison of image enhancement results on representative test images from
different domains using the proposed PACE method against state-of-the-art techniques
(CLAHE, HE, LIME, and MSRCR).

![comaprison 1](figures/t3.png)

> Figure 1: Chest X-ray (medical imaging). PACE delivers the most balanced and clinically useful enhancement. Lung vasculature, rib structures, and soft tissues appear sharply defined with excellent local contrast. In contrast, CLAHE and HE aggressively boost contrast, resulting in slight haloing and unnatural brightness around the mediastinum and heart region. LIME tends to darken portions of the image excessively, while MSRCR washes out fine structural details. PACE avoids these limitations and provides the highest diagnostic clarity.

For more detailed visual comparisons, see  
👉 [`examples/comparison`](../examples/comparison)


## 5. Results and Discussion

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

## 5. Impact
PACE is applicable in remote sensing, medical imaging, low-light photography, and computer vision preprocessing.

Key advantages:
- Fully automatic operation  
- Consistent performance  
- Linear complexity O(N)  
- Real-time capability  
- Multi-platform deployment  

## 6. Conclusions
PACE integrates adaptive parameter estimation with multi-signal processing and nonlinear stabilization, achieving a balance between contrast enhancement and structural preservation. The software is reproducible, modular, and suitable for real-world applications.