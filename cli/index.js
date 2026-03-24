#!/usr/bin/env node

import fs from "fs";
import sharp from "sharp";
import { applyPACE } from "../src/PACE.js";

// Polyfill ImageData for Node.js
if (typeof global.ImageData === "undefined") {
    global.ImageData = class {
        constructor(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
        }
    };
}

// ----------------------
// CLI Metadata
// ----------------------
const VERSION = "1.0.0";

// ----------------------
// Helpers
// ----------------------
const printHelp = () => {
    console.log(`
PACE - Perceptual Adaptive Contrast Enhancement

Usage:
  pace <input> <output> [options]

Options:
  --debug             Enable detailed debug logs & export it in JSON
  --strength <value>  Control enhancement strength (default: 1.0)
  --config <file>     Load options from JSON config file (supports override params)
  --help              Show this help message
  --version           Show version

Examples:
  pace input.jpg output.png
  pace input.jpg output.png --strength 0.8
  pace input.jpg output.png --debug
  pace input.jpg output.png --config config.json
`);
};

const exitWithError = (msg) => {
    console.error(`❌ ${msg}`);
    process.exit(1);
};

// ----------------------
// Parse Arguments
// ----------------------
const args = process.argv.slice(2);

if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
}

if (args.includes("--version")) {
    console.log(`PACE v${VERSION}`);
    process.exit(0);
}

const inputPath = args[0];
const outputPath = args[1];

if (!inputPath || !outputPath) {
    exitWithError("Missing input or output file.\nUse --help for usage.");
}

// Flags
const debug = args.includes("--debug");

// config for advance user
const configIndex = args.indexOf("--config");
let config = {};

if (configIndex !== -1) {
    const configPath = args[configIndex + 1];

    if (!configPath || !fs.existsSync(configPath)) {
        exitWithError("Invalid config file");
    }

    try {
        config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (e) {
        exitWithError("Failed to parse config JSON");
    }
}

// Strength
let strength = 1.0;
const strengthIndex = args.indexOf("--strength");

if (strengthIndex !== -1) {
    const value = parseFloat(args[strengthIndex + 1]);
    if (isNaN(value)) {
        exitWithError("Invalid value for --strength");
    }
    strength = value;
}

// Validate input
if (!fs.existsSync(inputPath)) {
    exitWithError(`Input file not found: ${inputPath}`);
}

// ----------------------
// Main Execution
// ----------------------
(async () => {
    try {
        console.log("🚀 PACE processing started...");
        console.log(`📥 Input: ${inputPath}`);
        console.log(`📤 Output: ${outputPath}`);

        const t0 = performance.now();

        // Read image
        const { data, info } = await sharp(inputPath)
            .raw()
            .ensureAlpha()
            .toBuffer({ resolveWithObject: true });

        const imageData = new ImageData(
            new Uint8ClampedArray(data),
            info.width,
            info.height
        );

        const options = {
            debug,
            strength,
            ...config
        };
        // Run PACE
        const result = await applyPACE(
            imageData,
            options
        );

        // Save output
        await sharp(Buffer.from(result.data), {
            raw: {
                width: result.width,
                height: result.height,
                channels: 4
            }
        }).toFile(outputPath);

        // Trigger debug export
        if (debug) {
            await import("../src/utils/debug.js").then(m => m.log(payload = { end: true }));
        }

        const t1 = performance.now();

        console.log("✅ Done");
        console.log(`⏱️ Time: ${(t1 - t0).toFixed(2)} ms`);

        if (debug) console.log("🧪 Debug mode enabled");

    } catch (err) {
        console.error("❌ Processing failed:");
        console.error(err.message || err);
        process.exit(1);
    }
})();