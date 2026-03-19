# PACE – Perceptual Adaptive Contrast Enhancement

**A structure-preserving, artifact-free contrast enhancer that adapts to every image**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-brightgreen?style=for-the-badge)](https://muhammedshahid.github.io/pace/)

---

### 🎯 Try it instantly
- **No installation** • **No Python** • **Runs 100% in your browser**
- Upload any image and see real-time enhancement in **under some ms** (tested on phones too)

**Live Demo**: [https://muhammedshahid.github.io/pace/](https://muhammedshahid.github.io/pace/)

---

### What is PACE?

**Perceptual Adaptive Contrast Enhancement (PACE)** is a feature-driven framework that intelligently blends three complementary enhancement signals:

- CLAHE-based local contrast
- Retinex-inspired reflectance estimation
- Laplacian texture/detail enhancement

All processing happens in the **perceptually uniform OKLab color space** (luminance only — colors stay perfectly natural).

A **global statistics controller** + **λ-Stability Regulator** + perceptual masks automatically tune every parameter so you get:
- Strong detail recovery
- No halos
- No noise amplification
- No highlight clipping
- No over-saturation

### Key Features

| Feature                        | Benefit                                      |
|--------------------------------|----------------------------------------------|
| Fully automatic & adaptive     | Zero manual parameters                       |
| OKLab luminance-only           | Perfect color fidelity                       |
| λ-Stability Regulator          | Prevents over-amplification in noisy areas   |
| Highlight Protection (β)       | Natural skin tones & bright regions          |
| Perceptual control maps        | Edge-aware, skin-damping, structure-aware    |
| Real-time JavaScript/WASM      | Works on phones, tablets & desktops          |
| O(N) complexity                | Linear scaling with image size               |

### Results (from the paper)

PACE achieves the **best balance** across all metrics:

- **Highest SSIM** (0.922) → best structural preservation
- **Highest PSNR** (23.93 dB)
- **Lowest MSE** (0.0043)
- **Highest Entropy** (14.56)
- Competitive perceptual scores while beating classical methods

**Visual comparison** (see paper Figure 9):
- HE, CLAHE, and MSRCR all show halos, noise, or washed-out colors
- PACE delivers clean, natural, detail-rich results

---

### How to use the demo

1. Click **"Choose Image"** (or drag & drop)
2. Wait for some time
3. See side-by-side comparison + exact processing time
4. (Coming soon: example buttons + parameter sliders)

---

### Technical Details (from the paper)

- Operates only on the **L channel** in OKLab
- Adaptive parameters derived from global statistics (mean, variance, entropy, edge density, noise ratio, etc.)
- Multi-signal blending with halo suppression and nonlinear compression
- Full algorithm described in **Algorithm 1** of the paper

---

### 📄 Full Research Paper

**Title**: Perceptual Adaptive Contrast Enhancement (PACE): A Structure-Preserving Approach for Image Enhancement and Analysis  
**Author**: Mohd. Shahid (Independent Researcher, Delhi, India)  
**Email**: smuhammed621@gmail.com

**Paper PDF** (coming soon on arXiv — link will be updated here)

---

### Citation

```bibtex
@misc{shahid2026pace,
  author = {Mohd. Shahid},
  title = {Perceptual Adaptive Contrast Enhancement (PACE): A Structure-Preserving Approach for Image Enhancement and Analysis},
  year = {2026},
  url = {https://github.com/muhammedshahid/pace}
}
