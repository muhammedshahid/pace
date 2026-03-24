import test from "node:test";
import assert from "node:assert";
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

test("PACE does not produce NaN or invalid values", async () => {
    const width = 8;
    const height = 8;

    const data = new Uint8ClampedArray(width * height * 4)
        .map(() => Math.floor(Math.random() * 255));

    const input = new ImageData(data, width, height);

    const output = await applyPACE(input);

    for (let i = 0; i < output.data.length; i++) {
        const val = output.data[i];
        assert.ok(!Number.isNaN(val), "NaN detected");
        assert.ok(val >= 0 && val <= 255, "Out of range");
    }
});