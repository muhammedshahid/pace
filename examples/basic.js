import sharp from "sharp";
import { PACE } from "../dist/pace.esm.js";

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

const run = async () => {
    const inputPath = "./examples/input/sample_input.jpg";
    const outputPath = "./examples/output/sample_output.png";

    const { data, info } = await sharp(inputPath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const imageData = new ImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height
    );

    const result = await PACE.enhance(imageData);

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