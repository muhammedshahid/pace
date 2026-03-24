import fs from "fs";
import sharp from "sharp";
import { applyPACE } from "../src/PACE.js";

if (typeof global.ImageData === "undefined") {
    global.ImageData = class {
        constructor(data, width, height) {
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

        const result = await applyPACE(imageData);

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