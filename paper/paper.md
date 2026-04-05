# PACE: A Lightweight Adaptive Image Enhancement Software Framework

## Abstract

PACE (Perceptual Adaptive Contrast Enhancement) is a lightweight, fully adaptive software framework for robust image enhancement. The system integrates global statistical analysis, local structural modulation, and perceptual multi-signal blending into a unified pipeline. Designed for reproducibility and ease of integration, PACE operates efficiently across diverse imaging conditions without requiring training or manual tuning. The software consistently improves perceptual quality and structural fidelity while maintaining computational efficiency, making it suitable for both research and real-world applications.

## Software Metadata
---
| Field                | Description  |
| -------------------- | -------------------------------------------------------------------------------- |
| Software name        | PACE (Perceptual Adaptive Contrast Enhancement)  |
| Version              | v3.1.1 |
| Repository           | [https://github.com/muhammedshahid/pace](https://github.com/muhammedshahid/pace) |
| DOI                  | 10.5281/zenodo.19203394  |
| License              | MIT License  |
| Programming language | JavaScript (Node.js, Browser, ESM) |
| Dependencies         | Minimal   |
| Operating systems    | Windows, Linux, macOS |
| Installation         | npm install pace  |
| Documentation        | GitHub README    |
| Support email        | [smuhammed621@gmail.com](mailto:smuhammed621@gmail.com) |
| Keywords             | image enhancement, adaptive processing, computer vision, OKLab color space, open-source software, real-time processing |

---

## 1. Introduction and Statement of Need

Image enhancement is a critical preprocessing step in computer vision and image analysis. Traditional approaches such as Histogram Equalization (HE) and CLAHE often suffer from over-enhancement and noise amplification, while Retinex-based approaches introduce computational complexity and visual artifacts.

There is a need for software that:

* Adapts automatically to image characteristics
* Preserves structural fidelity
* Is computationally efficient
* Is easy to integrate into existing pipelines

PACE addresses this need by providing a modular, adaptive enhancement framework combining statistical modeling and perceptual processing.

Unlike learning-based approaches, PACE does not require training data or model optimization.

---

## 2. Software Description

### 2.1 Architecture

PACE operates as a structured **global-to-local adaptive enhancement pipeline**, integrating statistical feature extraction, parameter inference, spatial modulation, and perceptual multi-signal blending.

![software Architecture](figures/arch.png)

> Figure 1: Overview of the proposed Perceptual Adaptive Contrast Enhancement (PACE) framework. The method operates in the OKLab color space and focuses on luminance-guided enhancement through two complementary pathways: (1) a global statistics-driven controller that adaptively estimates enhancement parameters, and (2) a local perceptual stream that generates spatially varying masks. Multiple enhancement cues—comprising CLAHE-based contrast modulation, Retinex-inspired illumination correction, and Laplacian-based texture amplification—are integrated via a perceptually guided blending strategy coupled with a nonlinear stability mechanism, yielding a structurally consistent and visually natural enhanced image.

PACE follows a global-to-local pipeline:

1. Global feature extraction
2. Adaptive parameter estimation
3. Local modulation
4. Multi-signal blending

### 2.2 Implementation

The software is implemented in JavaScript and supports:

* Browser (CDN)
* Node.js
* ES Modules
* CLI batch processing

### 2.3 Installation and Distribution

PACE is designed for high accessibility and can be integrated into diverse environments:

#### 2.3.1 Browser (CDN / Global Script)

For quick prototyping or integration into web tools without a build step:

```html
<script src="https://cdn.jsdelivr.net/gh/muhammedshahid/pace@main/dist/pace.min.js"></script>
```

#### 2.3.2 ES Modules (Modern Web)

For native browser support using standard import syntax:

```html
<script type="module"> 
  import { PACE, applyPACE } from "https://cdn.jsdelivr.net/gh/muhammedshahid/pace@main/dist/pace.esm.js";
  </script>
```
#### 2.3.3 Package Manager (Node.js/Bundlers)

For local development or server-side processing:

```bash
npm install pace
```

### 2.4 Usage and Advanced Configuration

PACE provides a high-level API designed for ease of integration. It can be used in server-side environments, modern web applications, or directly in the browser.

#### 2.4.1 Global Script (Legacy/CDN)

```js
// Options details illustrated in 'Options section'
const options = {
  strength: 2.0,      // Manually override the adaptive scaling factor
  debug: true,        // Export internal computed parameters (alpha, mu, sigma, etc.)
  config: "./my-params.json" // Path to a custom configuration file
};

// Available as a global PACE object
const output = PACE.enhance(imageData, options);
```

#### 2.4.2 Native Browser (ES Modules)

```js
import { applyPACE } from "https://cdn.jsdelivr.net/gh/muhammedshahid/pace@main/dist/pace.esm.js";

const output = await applyPACE(imageData, options);
```

#### 2.4.3 Node.js / Bundlers

```js
import { applyPACE } from "pace";
const output = await applyPACE(imageData, options);
```

#### Command Line Interface (CLI)
> For high-throughput scientific workflows, PACE supports a feature-rich CLI:

```bash
pace <input> <output> [options]
```

#### Options 

> PACE provides a flexible API and a Command Line Interface (CLI) to support both automated batch processing and interactive usage via options.

- `--debug` → Enable detailed debug logs (exports JSON)
- `--strength <value>` → Control enhancement strength (default: 1.0)
- `--config <file>` → Load JSON config for reproducibility or research workflow
- `--help` → Show help
- `--version` → Show version

#### Examples

```bash
pace input.jpg output.png
pace input.jpg output.png --strength 0.8
pace input.jpg output.png --debug
pace input.jpg output.png --config config.json

# Batch Processing
pace input_path output_path
```

#### Configuration (Advanced)

PACE is engineered to support the rigorous requirements of scientific reproducibility through a structured configuration.

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

##### Control Parameters

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


##### Perceptual Parameters

- **lambda (λ) — Stability Regulator**  
  Controls nonlinear contrast compression based on **contrast strength and noise energy**. Prevents unstable amplification in high-noise or high-contrast regions.

- **beta (β) — Highlight Protection**  
  Modulates enhancement in bright regions based on **luminance distribution skewness and highlight dominance**, preventing saturation and detail loss.

- **tau (τ) — Tone Limiter**  
  Limits enhancement in low-contrast regions to avoid excessive amplification and noise boosting.

- **edgeStabilizer (k) — Edge Stability Control**  
  Regulates edge enhancement stability based on noise level
  Higher noise → stronger stabilization → reduced artifacts near edges.

> Control parameters determine the global and local enhancement behavior
> Perceptual parameters enforce visual consistency and stability constraints


### 2.5 Features

* Perceptual-aware enhancement (not blind contrast stretching)
* Preserves edges, textures, structural details along with balanced contrast control
* Adaptive control using image statistics (no manual tuning required)
* Optional configurable parameters for fine-grained control
* No color distortion (Oklab-based processing)
* Multi-signal fusion (CLAHE, Retinex-inspired, Laplacian)
* Artifact suppression & structure preservation
* Cross-platform compatibility (Browser + Node.js + CLI)
* Fast JavaScript implementation
* CLI tool for batch processing
* Debug pipeline with JSON export (research-friendly)

---

## 3. Method Overview

PACE combines global statistics and local perception:

* Global distribution modeling
* Adaptive parameter computation
* Spatial modulation
* Multi-signal blending

Only key formulation is retained for clarity.

**Adaptive Strength**

```math
\alpha = \frac{0.5 I_{\text{imb}} + 0.3 C_{\text{need}} + 0.4 S_{\text{conf}}}{0.5 + 0.5 I_{\text{imb}} + 0.3 C_{\text{need}} + 0.4 S_{\text{conf}}}
```
> This formulation balances contrast demand, structural confidence, and illumination imbalance.

**Spatially Adaptive Alpha**

```math
\alpha(x,y) = \mathrm{clip}\left( \alpha \left[1 + 1.2 (C_{\text{loc}} - 0.5)\right], 0.05, 2\alpha \right)
```

> This enables spatially varying enhancement while preserving structural consistency.

**Combined Detail Signal**

```math
\Delta = \Delta_c + \eta \, \Delta_d \cdot M_d \cdot M_s \cdot M_e
```

**Final Enhanced Luminance**

```math
L_{\text{enh}} = \mathrm{clip}\left( L + \Delta' \cdot G_e \cdot M_l \cdot G_c, 0, 1 \right)
```
> Multiple enhancement signals(Clahe, Retinex & Laplacian) are combined using perceptual weighting to produce the final enhanced luminance.

---

## 4. Performance Evaluation

PACE is evaluated on:

* LOL dataset
* BSDS500 dataset

The following metrics are used:

- **MSE**       — pixel-level error
- **PSNR**      — reconstruction fidelity / signal quality
- **SSIM**      — structural similarity & perceptual fidelity
- **Entropy**   — information richness & detail content
- **CII**       — contrast improvement
- **NIQE**      — perceptual naturalness (no-reference)
- **BRISQUE**   — blind spatial quality (natural scene statistics)
- **PIQE**      — perception-based local distortion quality

### 4.1 Experimental Results

| Method | MSE ↓ | PSNR ↑ | SSIM ↑ | Entropy ↑ | CII ↑ | NIQE ↓ | BRISQUE ↓ | PIQE ↓ |
|--------|------|--------|--------|----------|----------|----------|----------|----------|
| HE     | 0.0500 | 15.58 | 0.6485 | 10.90 | **1.601** | 3.694 | 22.042 | 41.876 |
| CLAHE  | 0.0229 | 17.26 | 0.7611 | 13.65 | 1.282 | 3.090 | 14.688 | 34.947 |
| LIME   | 0.0510 | 13.09 | 0.7923 | **15.05** | 0.821 | **2.877** | 13.649 | **29.965** |
| MSRCR  | 0.1120 | 9.78  | 0.6573 | 13.43 | 0.399 | 3.417 | **6.792**  | 30.143 |
| **PACE** | **0.0043** | **23.93** | **0.9223** | 14.56 | 1.082 | 3.191 | 12.091 | 39.838 |

> Table 1. Average quantitative performance across 50 test images. For MSE, NIQE, BRISQUE and PIQE, lower values(↓) indicate better performance, whereas higher values(↑) are preferred for PSNR, SSIM, Entropy, CII

PACE achieves:
- **Lowest reconstruction error (MSE)**
- **Highest reconstruction quality (PSNR)**
- **Highest structural similarity (SSIM)**
- **High richness of information/details in the image (Entropy) without introducing noise**
- **Balanced information enhancement**

Results show consistent improvement in structural fidelity and perceptual quality compared to baseline methods.

> All methods were evaluated using consistent parameter settings and identical input conditions to ensure fair comparison.

---

## 5. Impact and Reuse Potential

### 5.1 Representative Use Case: Remote Sensing

PACE provides significant utility for remote sensing applications by enhancing low-contrast terrain features while preserving color fidelity. As illustrated in Figure 2, the framework improves the visibility of geographical boundaries, urban regions, and water bodies in satellite imagery without introducing artifacts.

![PACE Strength param demo](./figures/pace_strength_param.png)

> Figure 2: Impact of PACE on remote sensing imagery. Left: original satellite image. Center: fully adaptive enhancement (PACE Auto) providing natural contrast. Right: parameter-controlled enhancement (`--strength 2.0`) enabling improved visibility of fine-grained structures.

The parameter-controlled mode (e.g., `--strength 2.0`) allows users to emphasize subtle geological or structural features when required, complementing the default adaptive behavior that prioritizes perceptual naturalness.

> Similar improvements are observed across other domains, including medical imaging and natural scene enhancement, highlighting the general-purpose nature of the framework.

---

### 5.2 Reproducibility and Research Workflows

PACE is designed with reproducibility as a core principle:

- **Configuration-driven execution:** JSON-based configuration enables exact parameter replication across environments.
- **Diagnostic parameter export:** Using the `--debug` flag or `debug: true` API option, the software exports computed statistical features (e.g., entropy, illumination ratios, adaptive strength \\(\\alpha\\)).
- **Transparent processing:** These exports provide full visibility into internal decision-making, supporting auditability and scientific reporting.
- **Batch processing support:** CLI integration allows large-scale datasets to be processed under consistent and reproducible conditions.

---

### 5.3 Reuse Across Domains

The modular design of PACE enables reuse across multiple research domains:

- **Medical imaging:** Enhancing contrast in X-ray and MRI data for improved interpretability  
- **Remote sensing:** Supporting land-cover analysis and environmental monitoring  
- **Computer vision pipelines:** Serving as a preprocessing step for detection, segmentation, and recognition tasks  
- **General-purpose image enhancement:** Improving visual quality of everyday images (photography, web content, archival data) under diverse lighting and contrast conditions without domain-specific tuning

---

### 5.4 Integration and Extensibility

PACE is designed for straightforward integration and extensibility:

- **Cross-platform support:** Compatible with Node.js, modern browsers (ES Modules), and CDN-based usage  
- **Flexible API:** Fully automatic operation with optional parameter overrides for specialized use cases  
- **Lightweight design:** Minimal dependencies enable seamless integration into existing systems  

The software is reusable, extensible, and suitable for both research and production environments.

---

## 6. Reproducibility

Detailed instructions for reproducing results, including dataset preparation and execution steps, are provided in the repository’s reproducibility section.

A subset of 50 images is selected to ensure diversity in illumination, contrast, and scene structure. The selection includes:

- low-light images from LOL dataset  
- natural scenes from BSDS500  

Images are chosen to cover a representative range of visual conditions rather than a fixed predefined split.

> The evaluation pipeline is reproducible using the provided code and configuration files. Although the exact subset of images used in this study is not distributed, equivalent results can be obtained by applying the same procedure to the publicly available LOL and BSDS500 datasets.
> No hidden steps or proprietary tools are used.
---

## 7. Limitations and Future Work

* Linear complexity may impact very high-resolution images
* Current implementation is single-threaded

Future work includes:

* Parallel processing
* GPU acceleration
* Memory optimization

---

## 8. Conclusion

PACE provides a practical and efficient software solution for adaptive image enhancement. Its modular design and reproducibility make it suitable for both academic research and real-world deployment.

## References

[1] R.C. Gonzalez, R.E. Woods,  
Digital Image Processing, 3rd Edition, Pearson, 2008.

[2] K. Zuiderveld,  
Contrast Limited Adaptive Histogram Equalization,  
in: Graphics Gems IV, Academic Press, 1994, pp. 474–485.

[3] D.J. Jobson, Z. Rahman, G.A. Woodell,  
A multiscale retinex for bridging the gap between color images and the human observation of scenes,  
IEEE Transactions on Image Processing 6 (7) (1997) 965–976.

[4] X. Guo, Y. Li, H. Ling,  
LIME: Low-Light Image Enhancement via Illumination Map Estimation,  
IEEE Transactions on Image Processing 26 (2) (2017) 982–993.

[5] P. Arbelaez, M. Maire, C. Fowlkes, J. Malik,  
Contour Detection and Hierarchical Image Segmentation,  
IEEE Transactions on Pattern Analysis and Machine Intelligence 33 (5) (2011) 898–916.  
(BSDS500 Dataset)

[6] W. Wei, C. Wang, W. Yang, J. Liu,  
Deep Retinex Decomposition for Low-Light Enhancement,  
BMVC, 2018.  
(LOL Dataset)

[7] B. Ottosson,  
OKLab: A perceptual color space for image processing, 2020.  
Available: https://bottosson.github.io/posts/oklab/
