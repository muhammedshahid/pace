import fs from "node:fs";
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

const INPUT_DIR = "./examples/input/";
const OUTPUT_DIR = "./examples/output/";

const run = async () => {
    const files = fs.readdirSync(INPUT_DIR);

    for (const file of files) {
        if (!file.match(/\.(jpg|png|jpeg)$/)) continue;

        const inputPath = INPUT_DIR + file;
        const outputPath = OUTPUT_DIR + "enhanced-" + file;

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

        console.log("✅ Processed:", file);
    }
};

run();