#!/usr/bin/env python3

"""
Reproducibility Script: LIME Wrapper

Runs the official LIME implementation with fixed parameters
and collects outputs in a unified directory.
"""

import os
import subprocess
import shutil
from pathlib import Path

############################################
# SETTINGS
############################################

INPUT_DIR = "./inputs"
OUTPUT_DIR = "./outputs_lime"
LIME_DIR = "./LIME"   # path to cloned LIME repo

############################################
# CHECKS
############################################

if not os.path.exists(INPUT_DIR):
    raise FileNotFoundError(f"Input directory not found: {INPUT_DIR}")

if not os.path.exists(LIME_DIR):
    raise FileNotFoundError(
        "LIME repo not found. Clone it using:\n"
        "git clone https://github.com/estija/LIME.git"
    )

os.makedirs(OUTPUT_DIR, exist_ok=True)

############################################
# RUN LIME
############################################

print("🚀 Running LIME...")

cmd = [
    "python3",
    os.path.join(LIME_DIR, "demo.py"),
    "-f", INPUT_DIR,
    "-ul",
    "-l", "0.15",
    "-g", "0.6"
]

subprocess.run(cmd, check=True)

############################################
# COLLECT OUTPUTS
###########################################

print("📦 Collecting outputs...")

for root, _, files in os.walk(INPUT_DIR):
    for file in files:
        if "_lime" in file.lower():
            src = os.path.join(root, file)
            dst = os.path.join(OUTPUT_DIR, file)
            shutil.move(src, dst)

print("✅ LIME processing complete")
print(f"📁 Results saved in: {OUTPUT_DIR}")