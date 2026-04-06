# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---
### [3.1.2] - 2026-04-06
### 📦 Installation

```bash
npm install @shahid-labs/pace
```

### ✨ Highlights
- Published PACE as an installable npm package under @shahid-labs
- Added CLI support for direct usage via terminal
- Cross-platform build support (Windows, macOS, Linux)
- Improved Node.js compatibility (ESM + CommonJS)
---

### [3.1.1] - 2026-04-05
### Fixes
- Fixed Node.js compatibility issue by correctly using `.cjs` extension for CommonJS builds
- Resolved ESM/CJS interop errors affecting `require()` usage

### Improvements
- Introduced `rimraf` for reliable cross-platform cleanup during builds

---

---

### [3.1.0] - 2026-04-04
- Demo UI Updated, better UI & simple WebWorker implementation.
- utils/debug.js now has web worker support for browser also to download debug trace.

---

---

## [3.0.0] - 2026-03-28

### 🚀 Added
- Stable release of **PACE (Perceptual Adaptive Contrast Enhancement)** framework
- Perceptual image enhancement pipeline based on **OKLab color space**
- Adaptive multi-signal fusion combining:
  - CLAHE-based contrast enhancement
  - Retinex-inspired luminance adjustment
  - Gradient-based (Laplacian) detail enhancement
- Automatic parameter adaptation using image statistics (AUTO mode)
- Command-line interface (CLI) for batch image processing
- Reproducibility module with scripts and datasets for baseline comparisons
- Example implementations for Node.js and browser environments
- Comprehensive documentation and visual comparison results

### ⚡ Improved
- Enhanced structure preservation and edge-aware contrast control
- Reduced artifacts such as halo effects and over-enhancement
- Improved color fidelity using perceptual color modeling (OKLab)
- Refined API design for simplicity and usability

### 🧪 Testing
- Added unit and functional test coverage for core pipeline components

### 🔧 Infrastructure
- GitHub Actions CI pipeline (lint, build, test)
- ESLint configuration (modern flat config)
- Improved project structure for maintainability and reproducibility

---

## [2.0.0] - 2026-03-24

### 🚀 Added
- Initial public release with Zenodo integration
- Core PACE pipeline implementation
- Basic CLI support
- Initial documentation and usage examples

### 📦 Infrastructure
- Zenodo DOI generation for reproducible software citation

---

## [1.0.0] - Initial Release

### 🚀 Added
- Early prototype of PACE algorithm
- Initial experimentation with perceptual enhancement techniques
- Foundational implementation and internal testing