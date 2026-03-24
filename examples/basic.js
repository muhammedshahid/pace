import sharp from "sharp";
import { applyPACE } from "../src/PACE.js";

// Polyfill for Node
if (typeof global.ImageData === "undefined") {
    global.ImageData = class {
        constructor(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
        }
    };
}

const run = async () => {
    const inputPath = "./examples/input/sample.jpg";
    const outputPath = "./examples/output/basic.png";

    const { data, info } = await sharp(inputPath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const imageData = new ImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height
    );

    const result = await applyPACE(imageData);

    await sharp(Buffer.from(result.data), {
        raw: {
            width: result.width,
            height: result.height,
            channels: 4
        }
    }).toFile(outputPath);

    console.log("✅ Basic example done:", outputPath);
};

run();