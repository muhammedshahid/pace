import test from "node:test";
import assert from "node:assert";
import { applyPACE } from "../src/PACE.js";

// Polyfill
if (typeof global.ImageData === "undefined") {
    global.ImageData = class {
        constructor(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
        }
    };
}

test("PACE runs and returns valid ImageData", async () => {
    const width = 4;
    const height = 4;

    const data = new Uint8ClampedArray(width * height * 4).fill(128);

    const input = new ImageData(data, width, height);

    const output = await applyPACE(input);

    assert.ok(output);
    assert.strictEqual(output.width, width);
    assert.strictEqual(output.height, height);
    assert.strictEqual(output.data.length, data.length);
});