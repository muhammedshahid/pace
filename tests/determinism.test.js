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

test("PACE produces deterministic output", async () => {
    const width = 4;
    const height = 4;

    const data = new Uint8ClampedArray(width * height * 4).fill(100);

    const input = new ImageData(data, width, height);

    const out1 = await applyPACE(input);
    const out2 = await applyPACE(input);

    assert.deepStrictEqual(out1.data, out2.data);
});