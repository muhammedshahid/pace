---
title: "PACE: Perceptual Adaptive Contrast Enhancement"

tags:
  - image processing
  - contrast enhancement
  - computer vision
  - perceptual color space
  - OKLab

authors:
  - name: Mohd. Shahid
    affiliation: 1

affiliations:
  - name: Independent Researcher
    index: 1

date: 2026-03-28
bibliography: paper.bib
---

# Summary

Perceptual Adaptive Contrast Enhancement (PACE) is a structure-preserving image enhancement algorithm designed to improve visual quality while maintaining perceptual and structural fidelity. Unlike conventional contrast enhancement techniques such as Histogram Equalization (HE) and Contrast Limited Adaptive Histogram Equalization (CLAHE) [@pizer1987adaptive], as well as Retinex-based [@land1977retinex] and LIME [@guo2016lime] approaches, PACE operates in the OKLab perceptual color space and employs adaptive multi-signal blending to mitigate artifacts such as halo effects, over-enhancement, and color distortion.

The method is particularly suitable for applications in computer vision and image analysis pipelines, where both visibility enhancement and preservation of structural information are critical.

The software is implemented in JavaScript and is available as an open-source package with both programmatic and command-line interfaces.

# Statement of Need

Image enhancement is a fundamental preprocessing step in many computer vision tasks, particularly under varying light or high dynamic range conditions. Traditional methods such as Histogram Equalization (HE) and CLAHE often introduce unnatural contrast and loss of structural detail, while Retinex-based methods and LIME may produce color inconsistencies or amplify noise.

There is a clear need for a lightweight and perceptually grounded enhancement method that balances contrast improvement with structural preservation. PACE addresses this gap by integrating perceptual color modeling with adaptive enhancement strategies, making it suitable for both human visual interpretation and downstream machine learning applications.

# Functionality

PACE provides a complete JavaScript implementation of a perceptually guided contrast enhancement pipeline. The method operates in the OKLab color space to ensure perceptual consistency and applies adaptive multi-signal blending to balance global and local contrast adjustments.

Key features include:

* Perceptually guided image enhancement using the OKLab color space
* Adaptive contrast enhancement with explicit structure and edge preservation
* Multi-signal fusion combining CLAHE-based, Retinex-inspired, and gradient-based (Laplacian) cues
* Automatic parameter adaptation based on image statistics (no manual tuning required)
* Optional configurable parameters for fine-grained control
* Artifact suppression to mitigate halo effects, over-enhancement, and noise amplification
* Efficient JavaScript implementation compatible with both browser and Node.js environments
* Command-line interface (CLI) for batch processing and reproducible workflows
* Integration support for image processing and machine learning pipelines

The repository includes visual comparisons and example evaluations against established enhancement methods.

# Acknowledgements

This work builds upon established concepts in digital image processing and perceptual quality assessment, including foundational work on histogram equalization and structural similarity. The development of PACE was also influenced by prior research in perceptual color spaces and low-light image enhancement methods.
