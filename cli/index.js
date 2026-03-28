#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { performance } from "node:perf_hooks";
import sharp from "sharp";
import { PACE } from "../dist/pace.esm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(join(__dirname, "../package.json"), "utf-8")
);

const version = pkg.version;

// ------------------------------
// Polyfill ImageData for Node.js
// ------------------------------
if (typeof global.ImageData === "undefined") {
    global.ImageData = class {
        constructor(data, width, height) {
            if (!(data instanceof Uint8ClampedArray)) {
                throw new Error("ImageData expects Uint8ClampedArray");
            }
            this.data = data;
            this.width = width;
            this.height = height;
        }
    };
}

// -------
// Helpers
// -------
const printHelp = () => {
    console.log(`
PACE - Perceptual Adaptive Contrast Enhancement

Usage:
  pace <input> <output> [options]

Options:
  --debug             Enable detailed debug logs & export JSON
  --strength <value>  Control enhancement strength (0–5, default: 1.0)
  --config <file>     Load options from JSON config file
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

// ---------------
// Parse Arguments
// ---------------
const args = process.argv.slice(2);

if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
}

if (args.includes("--version")) {
    console.log(`PACE v${version}`);
    process.exit(0);
}

const inputPath = args[0];
const outputPath = args[1];

if (!inputPath || !outputPath) {
    exitWithError("Missing input or output file.\nUse --help for usage.");
}

// Flags
const debug = args.includes("--debug");

// ------
// Config
// ------
let config = {};
const configIndex = args.indexOf("--config");

if (configIndex !== -1) {
    const configPath = args[configIndex + 1];

    if (!configPath) {
        exitWithError("Missing value for --config");
    }

    if (!fs.existsSync(configPath)) {
        exitWithError(`Config file not found: ${configPath}`);
    }

    try {
        config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
        exitWithError("Failed to parse config JSON");
    }
}

// --------
// Strength
// --------
let strength = 1.0;
const strengthIndex = args.indexOf("--strength");

if (strengthIndex !== -1) {
    const valueRaw = args[strengthIndex + 1];

    if (!valueRaw) {
        exitWithError("Missing value for --strength");
    }

    const value = parseFloat(valueRaw);

    if (isNaN(value)) {
        exitWithError("Invalid value for --strength");
    }

    if (value <= 0 || value > 5) {
        exitWithError("Strength must be between 0 and 5");
    }

    strength = value;
}

// --------------
// Validate input
// --------------
if (!fs.existsSync(inputPath)) {
    exitWithError(`Input file not found: ${inputPath}`);
}

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// --------------
// Main Execution
// --------------
(async () => {
    try {
        console.log("🚀 PACE processing started...");
        console.log(`📥 Input: ${inputPath}`);
        console.log(`📤 Output: ${outputPath}`);
        // console.log(`🧠 Strength: ${strength}`);

        if (configIndex !== -1) {
            console.log(`⚙️  Config: ${args[configIndex + 1]}`);
        }

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

        // CLI overrides config
        const options = {
            debug,
            strength,
            ...config
        };

        // Run PACE
        const result = await PACE.enhance(imageData, options);

        // Save output
        await sharp(Buffer.from(result.data), {
            raw: {
                width: result.width,
                height: result.height,
                channels: 4
            }
        }).toFile(outputPath);

        const t1 = performance.now();

        console.log("✅ Done");
        console.log(`⏱️  Time: ${(t1 - t0).toFixed(2)} ms`);

        if (debug) console.log("🧪 Debug mode enabled");

    } catch (err) {
        console.error("❌ Processing failed:");
        console.error(err.message || err);
        process.exit(1);
    }
})();