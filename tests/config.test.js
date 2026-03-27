import test from "node:test";
import assert from "node:assert";
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

test("PACE respects strength parameter", async () => {
    const width = 4;
    const height = 4;

    const data = new Uint8ClampedArray(width * height * 4).fill(120);

    const input = new ImageData(data, width, height);

    const strong = await PACE.enhance(input, { strength: 1.0 });
    const weak = await PACE.enhance(input, { strength: 0.2 });

    // Expect difference
    let diff = 0;
    for (let i = 0; i < strong.data.length; i++) {
        diff += Math.abs(strong.data[i] - weak.data[i]);
    }

    assert.ok(diff > 0, "Strength parameter has no effect");
});