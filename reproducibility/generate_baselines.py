#!/usr/bin/env python3

"""
Reproducibility Script: Baseline Methods (HE, CLAHE, MSRCR)

This script processes all images in ./inputs (or inputs.zip) and generates:
- Histogram Equalization (HE)
- CLAHE
- MSRCR (Retinex)

Outputs are saved in ./outputs_baselines and zipped as enhanced_output.zip
"""

import os
import cv2
import zipfile
import numpy as np
from pathlib import Path
import shutil

############################################
# SETTINGS
############################################

INPUT_ZIP = "inputs.zip"
INPUT_DIR = "inputs"
OUTPUT_DIR = "outputs_baselines"

VALID_EXT = ('.png', '.jpg', '.jpeg', '.bmp', '.tiff')

############################################
# OKLAB CONVERSION
############################################

def rgb_to_oklab(img):
    img = img.astype(np.float32) / 255.0

    r, g, b = img[:, :, 2], img[:, :, 1], img[:, :, 0]

    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b

    l_, m_, s_ = np.cbrt(l), np.cbrt(m), np.cbrt(s)

    L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_
    A = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_
    B = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_

    return np.stack([L, A, B], axis=2)


def oklab_to_rgb(lab):
    L, A, B = lab[:, :, 0], lab[:, :, 1], lab[:, :, 2]

    l_ = L + 0.3963377774*A + 0.2158037573*B
    m_ = L - 0.1055613458*A - 0.0638541728*B
    s_ = L - 0.0894841775*A - 1.2914855480*B

    l, m, s = l_**3, m_**3, s_**3

    r = 4.0767416621*l - 3.3077115913*m + 0.2309699292*s
    g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s
    b = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s

    rgb = np.stack([b, g, r], axis=2)
    rgb = np.clip(rgb, 0, 1)

    return (rgb * 255).astype(np.uint8)

############################################
# METHODS
############################################

def apply_HE(L):
    L = (L * 255).astype(np.uint8)
    L = cv2.equalizeHist(L)
    return L.astype(np.float32) / 255


def apply_CLAHE(L):
    L = (L * 255).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    L = clahe.apply(L)
    return L.astype(np.float32) / 255


def MSRCR(img):
    img = img.astype(np.float32) + 1.0
    scales = [15, 80, 250]

    retinex = np.zeros_like(img)
    for s in scales:
        blur = cv2.GaussianBlur(img, (0, 0), s)
        retinex += np.log(img) - np.log(blur)

    retinex /= len(scales)

    return cv2.normalize(retinex, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

############################################
# PREP INPUT
############################################

if os.path.exists(INPUT_DIR):
    shutil.rmtree(INPUT_DIR)

if os.path.exists(INPUT_ZIP):
    print("📦 Extracting inputs.zip...")
    with zipfile.ZipFile(INPUT_ZIP, 'r') as z:
        z.extractall(INPUT_DIR)
else:
    print("⚠️ No inputs.zip found. Using existing inputs/ folder.")

os.makedirs(OUTPUT_DIR, exist_ok=True)

############################################
# PROCESS
############################################

for root, _, files in os.walk(INPUT_DIR):

    for file in files:
        if not file.lower().endswith(VALID_EXT):
            continue

        input_path = os.path.join(root, file)
        rel_path = os.path.relpath(root, INPUT_DIR)
        output_path = os.path.join(OUTPUT_DIR, rel_path)
        os.makedirs(output_path, exist_ok=True)

        print("Processing:", input_path)

        img = cv2.imread(input_path)
        if img is None:
            continue

        base = Path(file).stem

        try:
            oklab = rgb_to_oklab(img)
            L = oklab[:, :, 0]

            # HE
            he_L = apply_HE(L)
            he_img = oklab.copy()
            he_img[:, :, 0] = he_L
            he_img = oklab_to_rgb(he_img)

            cv2.imwrite(os.path.join(output_path, f"{base}_HE.png"), he_img)

            # CLAHE
            clahe_L = apply_CLAHE(L)
            clahe_img = oklab.copy()
            clahe_img[:, :, 0] = clahe_L
            clahe_img = oklab_to_rgb(clahe_img)

            cv2.imwrite(os.path.join(output_path, f"{base}_CLAHE.png"), clahe_img)

        except Exception:
            # fallback to LAB
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            L, A, B = cv2.split(lab)

            HE = cv2.equalizeHist(L)
            CLAHE = cv2.createCLAHE(3.0, (8, 8)).apply(L)

            he_img = cv2.cvtColor(cv2.merge([HE, A, B]), cv2.COLOR_LAB2BGR)
            clahe_img = cv2.cvtColor(cv2.merge([CLAHE, A, B]), cv2.COLOR_LAB2BGR)

            cv2.imwrite(os.path.join(output_path, f"{base}_HE.png"), he_img)
            cv2.imwrite(os.path.join(output_path, f"{base}_CLAHE.png"), clahe_img)

        # MSRCR
        msrcr_img = MSRCR(img)
        cv2.imwrite(os.path.join(output_path, f"{base}_MSRCR.png"), msrcr_img)

############################################
# ZIP OUTPUT
############################################

print("📦 Creating output archive...")
shutil.make_archive("enhanced_output", "zip", OUTPUT_DIR)

print("✅ Done. Output: enhanced_output.zip")