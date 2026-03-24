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

const run = async () => {
    const config = JSON.parse(
        fs.readFileSync("./examples/config.sample.json", "utf-8")
    );

    const { data, info } = await sharp("./examples/input/sample.jpg")
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

    const imageData = new ImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height
    );

    const result = await applyPACE(imageData, config);

    await sharp(Buffer.from(result.data), {
        raw: {
            width: result.width,
            height: result.height,
            channels: 4
        }
    }).toFile("./examples/output/config.png");

    console.log("✅ Config example done");
};

run();