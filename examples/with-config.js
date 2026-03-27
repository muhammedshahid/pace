import fs from "fs";
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
    const config = JSON.parse(
        fs.readFileSync("./examples/config.sample.json", "utf-8")
    );

    const { data, info } = await sharp("./examples/input/sample_input.jpg")
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const imageData = new ImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height
    );

    const result = await PACE.enhance(imageData, config);

    await sharp(Buffer.from(result.data), {
        raw: {
            width: result.width,
            height: result.height,
            channels: 4
        }
    }).toFile("./examples/output/sample_config.png");

    console.log("✅ Config example done");
};

run();