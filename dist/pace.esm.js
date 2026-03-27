var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils/colorSpaceConversion.js
var colorSpaceConversion_exports = {};
__export(colorSpaceConversion_exports, {
  linearToRgb: () => linearToRgb,
  oklabPlanesToRgb: () => oklabPlanesToRgb,
  oklabToRgb: () => oklabToRgb,
  rgbToLinear: () => rgbToLinear,
  rgbToLuminance: () => rgbToLuminance,
  rgbToOklab: () => rgbToOklab,
  rgbToOklabPlanes: () => rgbToOklabPlanes
});
var SRGB_TO_LINEAR = new Float32Array(256);
var LINEAR_TO_SRGB_LUT_SIZE = 4096;
var LINEAR_TO_SRGB = new Uint8ClampedArray(LINEAR_TO_SRGB_LUT_SIZE);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  SRGB_TO_LINEAR[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
for (let i = 0; i < LINEAR_TO_SRGB_LUT_SIZE; i++) {
  const linear = i / (LINEAR_TO_SRGB_LUT_SIZE - 1);
  const srgb = linear <= 31308e-7 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
  LINEAR_TO_SRGB[i] = srgb * 255 + 0.5 | 0;
}
var INV_GAMMA = 1 / 2.4;
var LUT_SIZE = 4096;
var gammaLUT = new Uint8ClampedArray(LUT_SIZE);
for (let i = 0; i < LUT_SIZE; i++) {
  const x = i / (LUT_SIZE - 1);
  const srgb = x <= 31308e-7 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  gammaLUT[i] = Math.round(srgb * 255);
}
var CBRT_LUT_SIZE = 4096;
var CBRT_LUT = new Float32Array(CBRT_LUT_SIZE);
for (let i = 0; i < CBRT_LUT_SIZE; i++) {
  CBRT_LUT[i] = Math.cbrt(i / (CBRT_LUT_SIZE - 1));
}
function fastCbrt(x) {
  return x ** 0.3333333333;
}
function lutCbrt(x) {
  const lut = CBRT_LUT;
  const max = CBRT_LUT_SIZE - 1;
  const idx = x * max | 0;
  return idx >= 0 && idx <= max ? lut[idx] : fastCbrt(x);
}
function rgbToOklab(src) {
  const pixelCount = src.length >> 2;
  const out = new Float32Array(pixelCount * 3);
  let j = 0;
  for (let i = 0; i < src.length; i += 4) {
    const lr = SRGB_TO_LINEAR[src[i]];
    const lg = SRGB_TO_LINEAR[src[i + 1]];
    const lb = SRGB_TO_LINEAR[src[i + 2]];
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    const l_ = l ** (1 / 3);
    const m_ = m ** (1 / 3);
    const s_ = s ** (1 / 3);
    out[j++] = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    out[j++] = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    out[j++] = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  }
  return out;
}
function rgbToOklabPlanes(src) {
  const pixelCount = src.length >> 2;
  const L_plane = new Float32Array(pixelCount);
  const a_plane = new Float32Array(pixelCount);
  const b_plane = new Float32Array(pixelCount);
  const srgbToLinear = SRGB_TO_LINEAR;
  let i = 0;
  let j = 0;
  const end = pixelCount & ~1;
  for (; j < end; j += 2, i += 8) {
    const lr1 = srgbToLinear[src[i]];
    const lg1 = srgbToLinear[src[i + 1]];
    const lb1 = srgbToLinear[src[i + 2]];
    const l1 = 0.4122214708 * lr1 + 0.5363325363 * lg1 + 0.0514459929 * lb1;
    const m1 = 0.2119034982 * lr1 + 0.6806995451 * lg1 + 0.1073969566 * lb1;
    const s1 = 0.0883024619 * lr1 + 0.2817188376 * lg1 + 0.6299787005 * lb1;
    const l_1 = lutCbrt(l1);
    const m_1 = lutCbrt(m1);
    const s_1 = lutCbrt(s1);
    L_plane[j] = 0.2104542553 * l_1 + 0.793617785 * m_1 - 0.0040720468 * s_1;
    a_plane[j] = 1.9779984951 * l_1 - 2.428592205 * m_1 + 0.4505937099 * s_1;
    b_plane[j] = 0.0259040371 * l_1 + 0.7827717662 * m_1 - 0.808675766 * s_1;
    const lr2 = srgbToLinear[src[i + 4]];
    const lg2 = srgbToLinear[src[i + 5]];
    const lb2 = srgbToLinear[src[i + 6]];
    const l2 = 0.4122214708 * lr2 + 0.5363325363 * lg2 + 0.0514459929 * lb2;
    const m2 = 0.2119034982 * lr2 + 0.6806995451 * lg2 + 0.1073969566 * lb2;
    const s2 = 0.0883024619 * lr2 + 0.2817188376 * lg2 + 0.6299787005 * lb2;
    const l_2 = lutCbrt(l2);
    const m_2 = lutCbrt(m2);
    const s_2 = lutCbrt(s2);
    L_plane[j + 1] = 0.2104542553 * l_2 + 0.793617785 * m_2 - 0.0040720468 * s_2;
    a_plane[j + 1] = 1.9779984951 * l_2 - 2.428592205 * m_2 + 0.4505937099 * s_2;
    b_plane[j + 1] = 0.0259040371 * l_2 + 0.7827717662 * m_2 - 0.808675766 * s_2;
  }
  if (j < pixelCount) {
    const lr = srgbToLinear[src[i]];
    const lg = srgbToLinear[src[i + 1]];
    const lb = srgbToLinear[src[i + 2]];
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    const l_ = lutCbrt(l);
    const m_ = lutCbrt(m);
    const s_ = lutCbrt(s);
    L_plane[j] = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    a_plane[j] = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    b_plane[j] = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  }
  return {
    L: L_plane,
    a: a_plane,
    b: b_plane,
    pixelCount
  };
}
function oklabToRgb(src) {
  const pixelCount = src.length / 3;
  const out = new Uint8ClampedArray(pixelCount * 4);
  let j = 0;
  for (let i = 0; i < src.length; i += 3) {
    const L = src[i];
    const a = src[i + 1];
    const b = src[i + 2];
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    let lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    lr = lr <= 0 ? 0 : lr >= 1 ? 1 : lr;
    lg = lg <= 0 ? 0 : lg >= 1 ? 1 : lg;
    lb = lb <= 0 ? 0 : lb >= 1 ? 1 : lb;
    lr = lr <= 31308e-7 ? lr * 12.92 : 1.055 * Math.pow(lr, INV_GAMMA) - 0.055;
    lg = lg <= 31308e-7 ? lg * 12.92 : 1.055 * Math.pow(lg, INV_GAMMA) - 0.055;
    lb = lb <= 31308e-7 ? lb * 12.92 : 1.055 * Math.pow(lb, INV_GAMMA) - 0.055;
    out[j++] = lr * 255 + 0.5 | 0;
    out[j++] = lg * 255 + 0.5 | 0;
    out[j++] = lb * 255 + 0.5 | 0;
    out[j++] = 255;
  }
  return out;
}
function oklabPlanesToRgb(L, a, b) {
  const n = L.length;
  const rgb = new Uint8ClampedArray(n * 4);
  for (let i = 0, j = 0; i < n; i++, j += 4) {
    const Ls = L[i];
    const as = a[i];
    const bs = b[i];
    const l_ = Ls + 0.3963377774 * as + 0.2158037573 * bs;
    const m_ = Ls - 0.1055613458 * as - 0.0638541728 * bs;
    const s_ = Ls - 0.0894841775 * as - 1.291485548 * bs;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    if (r < 0) r = 0;
    else if (r > 1) r = 1;
    if (g < 0) g = 0;
    else if (g > 1) g = 1;
    if (b2 < 0) b2 = 0;
    else if (b2 > 1) b2 = 1;
    const ri = r * (LUT_SIZE - 1) | 0;
    const gi = g * (LUT_SIZE - 1) | 0;
    const bi = b2 * (LUT_SIZE - 1) | 0;
    rgb[j] = gammaLUT[ri];
    rgb[j + 1] = gammaLUT[gi];
    rgb[j + 2] = gammaLUT[bi];
    rgb[j + 3] = 255;
  }
  return rgb;
}
function rgbToLinear(src) {
  const pixelCount = src.length >> 2;
  const out = new Float32Array(pixelCount * 4);
  let j = 0;
  for (let i = 0; i < src.length; i += 4) {
    out[j++] = SRGB_TO_LINEAR[src[i]];
    ;
    out[j++] = SRGB_TO_LINEAR[src[i + 1]];
    out[j++] = SRGB_TO_LINEAR[src[i + 2]];
    out[j++] = src[i + 3];
  }
  return out;
}
function linearToRgb(src) {
  const pixelCount = src.length >> 2;
  const out = new Uint8ClampedArray(pixelCount * 4);
  const scale = LINEAR_TO_SRGB_LUT_SIZE - 1;
  let j = 0;
  for (let i = 0; i < src.length; i += 4) {
    let r = src[i];
    let g = src[i + 1];
    let b = src[i + 2];
    r = r <= 0 ? 0 : r >= 1 ? 1 : r;
    g = g <= 0 ? 0 : g >= 1 ? 1 : g;
    b = b <= 0 ? 0 : b >= 1 ? 1 : b;
    out[j++] = LINEAR_TO_SRGB[r * scale | 0];
    out[j++] = LINEAR_TO_SRGB[g * scale | 0];
    out[j++] = LINEAR_TO_SRGB[b * scale | 0];
    out[j++] = src[i + 3];
  }
  return out;
}
function rgbToLuminance(src) {
  const pixelCount = src.length >> 2;
  const out = new Float32Array(pixelCount);
  let j = 0;
  for (let i = 0; i < src.length; i += 4) {
    const lr = SRGB_TO_LINEAR[src[i]];
    const lg = SRGB_TO_LINEAR[src[i + 1]];
    const lb = SRGB_TO_LINEAR[src[i + 2]];
    out[j++] = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  }
  return out;
}

// src/utils/blur_optimised.js
var blur_optimised_exports = {};
__export(blur_optimised_exports, {
  boxBlurAlphaMap: () => boxBlurAlphaMap,
  guidedAlphaSmoothing: () => guidedAlphaSmoothing,
  smooth3x3: () => smooth3x3,
  smooth5x5: () => smooth5x5,
  smooth7x7: () => smooth7x7
});
var LUT_SIZE2 = 1024;
var sigma = 0.1;
var weightLUT = new Float32Array(LUT_SIZE2);
for (let i = 0; i < LUT_SIZE2; i++) {
  const d = i / (LUT_SIZE2 - 1);
  weightLUT[i] = Math.exp(-(d * d) / sigma);
}
function boxBlurAlphaMap(alphaMap, width, height) {
  const n = alphaMap.length;
  const temp = new Float32Array(n);
  const out = new Float32Array(n);
  const inv3 = 1 / 3;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      temp[i] = (alphaMap[i - 1] + alphaMap[i] + alphaMap[i + 1]) * inv3;
    }
  }
  const w = width;
  for (let y = 1; y < height - 1; y++) {
    const row = y * w;
    for (let x = 0; x < width; x++) {
      const i = row + x;
      out[i] = (temp[i - w] + temp[i] + temp[i + w]) * inv3;
    }
  }
  return out;
}
function guidedAlphaSmoothing(alphaMap, L, width, height) {
  const n = alphaMap.length;
  const out = new Float32Array(n);
  const lutScale = LUT_SIZE2 - 1;
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      const centerL = L[i];
      let sum = 0;
      let wsum = 0;
      const j0 = i - width - 1;
      const j1 = i - width;
      const j2 = i - width + 1;
      const j3 = i - 1;
      const j4 = i;
      const j5 = i + 1;
      const j6 = i + width - 1;
      const j7 = i + width;
      const j8 = i + width + 1;
      const idx0 = Math.min(Math.abs(L[j0] - centerL) * lutScale | 0, lutScale);
      const idx1 = Math.min(Math.abs(L[j1] - centerL) * lutScale | 0, lutScale);
      const idx2 = Math.min(Math.abs(L[j2] - centerL) * lutScale | 0, lutScale);
      const idx3 = Math.min(Math.abs(L[j3] - centerL) * lutScale | 0, lutScale);
      const idx4 = 0;
      const idx5 = Math.min(Math.abs(L[j5] - centerL) * lutScale | 0, lutScale);
      const idx6 = Math.min(Math.abs(L[j6] - centerL) * lutScale | 0, lutScale);
      const idx7 = Math.min(Math.abs(L[j7] - centerL) * lutScale | 0, lutScale);
      const idx8 = Math.min(Math.abs(L[j8] - centerL) * lutScale | 0, lutScale);
      const w0 = weightLUT[idx0];
      const w1 = weightLUT[idx1];
      const w2 = weightLUT[idx2];
      const w3 = weightLUT[idx3];
      const w4 = weightLUT[idx4];
      const w5 = weightLUT[idx5];
      const w6 = weightLUT[idx6];
      const w7 = weightLUT[idx7];
      const w8 = weightLUT[idx8];
      sum = alphaMap[j0] * w0 + alphaMap[j1] * w1 + alphaMap[j2] * w2 + alphaMap[j3] * w3 + alphaMap[j4] * w4 + alphaMap[j5] * w5 + alphaMap[j6] * w6 + alphaMap[j7] * w7 + alphaMap[j8] * w8;
      wsum = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8;
      out[i] = sum / (wsum + 1e-12);
    }
  }
  return out;
}
function smooth3x3(L, width, height) {
  const n = L.length;
  const temp = new Float32Array(n);
  const out = new Float32Array(n);
  const w = width;
  for (let y = 1; y < height - 1; y++) {
    const row = y * w;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      temp[i] = (L[i - 1] + 2 * L[i] + L[i + 1]) * 0.25;
    }
  }
  for (let y = 1; y < height - 1; y++) {
    const row = y * w;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      out[i] = (temp[i - w] + 2 * temp[i] + temp[i + w]) * 0.25;
    }
  }
  return out;
}
function smooth5x5(L, width, height) {
  const n = L.length;
  const temp = new Float32Array(n);
  const out = new Float32Array(n);
  const inv5 = 0.2;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 2; x < width - 2; x++) {
      const i = row + x;
      const sum = L[i - 2] + L[i - 1] + L[i] + L[i + 1] + L[i + 2];
      temp[i] = sum * inv5;
    }
  }
  for (let y = 2; y < height - 2; y++) {
    const row = y * width;
    const w1 = width;
    const w2 = 2 * width;
    for (let x = 0; x < width; x++) {
      const i = row + x;
      const sum = temp[i - w2] + temp[i - w1] + temp[i] + temp[i + w1] + temp[i + w2];
      out[i] = sum * inv5;
    }
  }
  return out;
}
function smooth7x7(L, width, height) {
  const temp = new Float32Array(L.length);
  const out = new Float32Array(L.length);
  const w0 = 1, w1 = 6, w2 = 15, w3 = 20;
  const norm = 64;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 3; x < width - 3; x++) {
      const i = row + x;
      temp[i] = (w0 * (L[i - 3] + L[i + 3]) + w1 * (L[i - 2] + L[i + 2]) + w2 * (L[i - 1] + L[i + 1]) + w3 * L[i]) / norm;
    }
  }
  for (let y = 3; y < height - 3; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const i = row + x;
      out[i] = (w0 * (temp[i - 3 * width] + temp[i + 3 * width]) + w1 * (temp[i - 2 * width] + temp[i + 2 * width]) + w2 * (temp[i - width] + temp[i + width]) + w3 * temp[i]) / norm;
    }
  }
  return out;
}

// src/utils/debug.js
var debug_exports = {};
__export(debug_exports, {
  log: () => log,
  preview: () => preview
});
var preview = (arr, n = 10) => ({
  sample: arr.slice(0, n),
  length: arr.length
});
var __PACE_TRACE__ = {
  meta: {},
  stages: []
};
var __STAGE_INDEX__ = 0;
var __LAST_TIME__ = performance.now();
var __SESSION_ID__ = `pace-${Date.now()}`;
var log = async (stage, label, payload = {}) => {
  if (payload.end) {
    const json = JSON.stringify(__PACE_TRACE__, null, 2);
    const filename = `pace-trace-${__SESSION_ID__}.json`;
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
      } catch (e) {
        console.warn("Browser download failed");
      }
    } else if (typeof process !== "undefined" && process.versions?.node) {
      try {
        const fs = await import("fs");
        fs.writeFileSync(filename, json);
        console.log(`\u{1F4C1} Trace saved: ${filename}`);
      } catch (e) {
        console.error("Node file write failed:", e);
      }
    }
    __PACE_TRACE__ = { meta: {}, stages: [] };
    __STAGE_INDEX__ = 0;
    __LAST_TIME__ = performance.now();
    __SESSION_ID__ = `pace-${Date.now()}`;
    return json;
  }
  const now = performance.now();
  const duration = now - __LAST_TIME__;
  __LAST_TIME__ = now;
  __STAGE_INDEX__++;
  __PACE_TRACE__.stages.push({
    stage,
    label,
    index: __STAGE_INDEX__,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    duration: Number(duration.toFixed(3)),
    // ms
    ...payload.input && { input: payload.input },
    ...payload.params && { params: payload.params },
    ...payload.output && { output: payload.output }
  });
  if (!__PACE_TRACE__.meta.image && payload.input?.width && payload.input?.height) {
    __PACE_TRACE__.meta.image = {
      width: payload.input.width,
      height: payload.input.height
    };
  }
  console.groupCollapsed(
    `\u{1F7E6} [PACE] ${__STAGE_INDEX__}. ${stage} \u2192 ${label} (${duration.toFixed(2)} ms)`
  );
  if (payload.input) console.log("\u{1F539} Input:", payload.input);
  if (payload.params) console.log("\u2699\uFE0F Params:", payload.params);
  if (payload.output) console.log("\u{1F7E2} Output:", payload.output);
  console.groupEnd();
};

// src/stats/extractGlobalFeatures.js
var HIST_BINS = 512;
var LOG2_BINS = 9;
var EPS = 1e-12;
function computeDistribution(L) {
  const n = L.length;
  const hist = new Float32Array(HIST_BINS);
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    const v = L[i];
    sum += v;
    sumSq += v * v;
    const bin = Math.min(HIST_BINS - 1, v * (HIST_BINS - 1) | 0);
    hist[bin]++;
  }
  const mean = sum / n;
  const variance = Math.max(0, sumSq / n - mean * mean);
  const std = Math.sqrt(variance);
  let skewAcc = 0;
  let kurtAcc = 0;
  for (let i = 0; i < n; i++) {
    const d = L[i] - mean;
    const d2 = d * d;
    skewAcc += d2 * d;
    kurtAcc += d2 * d2;
  }
  const skewness = skewAcc / (n * Math.pow(std + EPS, 3));
  const kurtosis = kurtAcc / (n * Math.pow(std + EPS, 4));
  let entropy = 0;
  const invN = 1 / n;
  let cumulative = 0;
  let p5 = 0;
  let p95 = 0;
  let shadowCount = 0;
  let highlightCount = 0;
  for (let i = 0; i < HIST_BINS; i++) {
    const p = hist[i] * invN;
    if (p > 0) {
      entropy -= p * Math.log2(p + EPS);
    }
    cumulative += p;
    if (!p5 && cumulative >= 0.05) {
      p5 = i / (HIST_BINS - 1);
    }
    if (!p95 && cumulative >= 0.95) {
      p95 = i / (HIST_BINS - 1);
    }
  }
  const dynamicRange = p95 - p5;
  const normalizedEntropy = entropy / LOG2_BINS;
  for (let i = 0; i < n; i++) {
    if (L[i] < 0.2) shadowCount++;
    if (L[i] > 0.8) highlightCount++;
  }
  return {
    mean,
    variance,
    std,
    skewness,
    kurtosis,
    entropy: normalizedEntropy,
    dynamicRange,
    shadowRatio: shadowCount / n,
    highlightRatio: highlightCount / n
  };
}
function computeStructure(L, width, height) {
  let sumGrad = 0;
  let sumGradSq = 0;
  let count = 0;
  for (let y = 1; y < height; y++) {
    for (let x = 1; x < width; x++) {
      const i = y * width + x;
      const gx = L[i] - L[i - 1];
      const gy = L[i] - L[i - width];
      const ax = Math.abs(gx);
      const ay = Math.abs(gy);
      const max = ax > ay ? ax : ay;
      const min = ax > ay ? ay : ax;
      const grad = max + 0.25 * min;
      sumGrad += grad;
      sumGradSq += grad * grad;
      count++;
    }
  }
  const meanGradient = sumGrad / count;
  const gradientVariance = sumGradSq / count - meanGradient * meanGradient;
  const textureIndex = gradientVariance / (meanGradient + EPS);
  return {
    meanGradient,
    gradientVariance,
    // edgeDensity,
    textureIndex
  };
}
function computeNoise(L, width, height, variance_L) {
  let sumNoise = 0;
  let sumLocalVar = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const localMean = (L[i - 1] + L[i + 1] + L[i - width] + L[i + width]) * 0.25;
      const diff = Math.abs(L[i] - localMean);
      sumNoise += diff;
      sumLocalVar += diff * diff;
      count++;
    }
  }
  const noiseMean = sumNoise / count;
  const noiseRatio = noiseMean / (variance_L + EPS);
  const microContrast = sumLocalVar / count;
  return {
    noiseMean,
    noiseRatio,
    microContrast
  };
}
function extractGlobalFeatures(L, width, height) {
  const distribution = computeDistribution(L);
  const structure = computeStructure(L, width, height);
  const noise = computeNoise(L, width, height, distribution.variance);
  const rawEdge = structure.meanGradient;
  const noiseAdjusted = rawEdge / (1 + 0.5 * noise.noiseRatio);
  const edgeDensity = noiseAdjusted / (noiseAdjusted + 0.25);
  structure.edgeDensity = edgeDensity;
  const featureVector = [
    distribution.mean,
    distribution.variance,
    distribution.skewness,
    distribution.kurtosis,
    distribution.entropy,
    distribution.dynamicRange,
    distribution.shadowRatio,
    distribution.highlightRatio,
    structure.edgeDensity,
    structure.textureIndex,
    noise.noiseRatio,
    noise.microContrast
  ];
  return {
    distribution,
    structure,
    noise,
    featureVector
  };
}

// src/controller/computeAdaptiveParams.js
function computeLambda(features) {
  const { distribution, structure, noise } = features;
  const {
    variance,
    dynamicRange
  } = distribution;
  const {
    edgeDensity,
    textureIndex
  } = structure;
  const {
    noiseRatio,
    microContrast
  } = noise;
  const contrastStrength = 0.6 * Math.sqrt(variance) + 0.5 * dynamicRange + 0.4 * edgeDensity;
  const noiseEnergy = noiseRatio + 0.7 * microContrast;
  let lambda = 0.3 + 0.8 * (1 - contrastStrength) + 1.2 * noiseEnergy + 0.4 * textureIndex;
  lambda = lambda / (1 + lambda);
  return lambda;
}
function computeBeta(features) {
  const {
    highlightRatio,
    shadowRatio,
    skewness,
    dynamicRange,
    mean
  } = features.distribution;
  const highlightDominance = highlightRatio + 0.4 * Math.max(0, skewness) + 0.3 * mean + 0.2 * dynamicRange;
  const shadowCompensation = 0.5 * shadowRatio;
  const x = highlightDominance - shadowCompensation;
  let beta = 0.8 * (x / (1 + Math.abs(x)));
  return beta;
}
function computeTau(variance, entropy) {
  const contrastFactor = 1 - Math.sqrt(variance);
  const entropyFactor = 1 - entropy * 0.5;
  const tau = 0.35 + 0.8 * contrastFactor * entropyFactor;
  return Math.min(1.2, Math.max(0.35, tau));
}
function computeEdgeK(noiseRatio) {
  const k = 0.015 + 0.25 * noiseRatio;
  return Math.min(0.25, Math.max(0.01, k));
}
function computePerceptualParams(features) {
  const lambda = computeLambda(features);
  const beta = computeBeta(features);
  const tau = computeTau(features.distribution.variance, features.distribution.entropy);
  const edgeStabilizer = computeEdgeK(features.noise.noiseRatio);
  return { lambda, beta, tau, edgeStabilizer };
}
function computeControlParams(features) {
  const {
    distribution,
    structure,
    noise
  } = features;
  const entropy = distribution.entropy;
  const dynamicRange = distribution.dynamicRange;
  const shadowRatio = distribution.shadowRatio;
  const highlightRatio = distribution.highlightRatio;
  const edgeDensity = structure.edgeDensity;
  const noiseRatio = noise.noiseRatio;
  const contrastNeed = (1 - entropy) * (1 - dynamicRange);
  const structureConfidence = edgeDensity / (1 + noiseRatio);
  const imbalance = Math.abs(shadowRatio - highlightRatio);
  const alphaRaw = 0.5 * imbalance + 0.3 * contrastNeed + 0.4 * structureConfidence;
  const globalAlpha = alphaRaw / (alphaRaw + 0.5);
  const granularity = structureConfidence - 0.5 * noiseRatio;
  let tileSize = 32 - 16 * granularity;
  tileSize = Math.max(8, Math.min(64, tileSize));
  tileSize = Math.round(tileSize / 8) * 8;
  const clipLimit = 0.02 + 0.08 * structureConfidence;
  return {
    globalAlpha,
    tileSize,
    clipLimit,
    internal: {
      contrastNeed,
      structureConfidence,
      imbalance
    }
  };
}
function computeAdaptiveParams(features) {
  const controlParams = computeControlParams(features);
  const perceptualParams = computePerceptualParams(features);
  return {
    controlParams,
    perceptualParams
  };
}

// src/controller/maps_optimized.js
var maps_optimized_exports = {};
__export(maps_optimized_exports, {
  computeControlMaps: () => computeControlMaps
});
var EPS2 = 1e-12;
var LUT_SIZE3 = 1024;
var skinLUT = new Float32Array(LUT_SIZE3);
var mid = 0.5;
var sigma2 = 0.18;
var denom = 2 * sigma2 * sigma2;
for (let i = 0; i < LUT_SIZE3; i++) {
  const L = i / (LUT_SIZE3 - 1);
  const d = L - mid;
  skinLUT[i] = 1 - 0.7 * Math.exp(-(d * d) / denom);
}
function computeGradient(L, width, height) {
  const n = L.length;
  const gx = new Float32Array(n);
  const gy = new Float32Array(n);
  for (let y = 1; y < height; y++) {
    const row = y * width;
    for (let x = 1; x < width; x++) {
      const i = row + x;
      gx[i] = L[i] - L[i - 1];
      gy[i] = L[i] - L[i - width];
    }
  }
  return { gx, gy };
}
function computeMaps(L, gx, gy, width, height) {
  const n = L.length;
  const edgeMap = new Float32Array(n);
  const structureMask = new Float32Array(n);
  const skinDampMap = new Float32Array(n);
  let maxStruct = 0;
  for (let i = 0; i < n; i++) {
    const ax = Math.abs(gx[i]);
    const ay = Math.abs(gy[i]);
    const max = ax > ay ? ax : ay;
    const min = ax > ay ? ay : ax;
    const grad = max + 0.25 * min;
    edgeMap[i] = grad;
    const struct = Math.sqrt(gx[i] * gx[i] + gy[i] * gy[i]);
    structureMask[i] = struct;
    if (struct > maxStruct) maxStruct = struct;
    const idx = L[i] * (LUT_SIZE3 - 1) | 0;
    skinDampMap[i] = skinLUT[idx];
  }
  const invMax = 1 / (maxStruct + 1e-6);
  for (let i = 0; i < n; i++) {
    structureMask[i] *= invMax;
  }
  return { edgeMap, structureMask, skinDampMap };
}
function computeLocalAlphaMap(L, gx, gy, width, height, globalAlpha, globalNoiseRatio, tileSize) {
  const alphaMap = new Float32Array(width * height);
  const k = 0.7 * globalNoiseRatio + 0.05;
  const strength = 1.2;
  for (let ty = 0; ty < height; ty += tileSize) {
    const yEnd = Math.min(ty + tileSize, height);
    for (let tx = 0; tx < width; tx += tileSize) {
      const xEnd = Math.min(tx + tileSize, width);
      let sumGrad = 0;
      let sumGradSq = 0;
      let sumNoise = 0;
      let sumL = 0;
      let count = 0;
      for (let y = ty + 1; y < yEnd - 1; y++) {
        const row = y * width;
        for (let x = tx + 1; x < xEnd - 1; x++) {
          const i = row + x;
          const ax = Math.abs(gx[i]);
          const ay = Math.abs(gy[i]);
          const max = ax > ay ? ax : ay;
          const min = ax > ay ? ay : ax;
          const grad = max + 0.25 * min;
          sumGrad += grad;
          sumGradSq += grad * grad;
          const localMean = (L[i - 1] + L[i + 1] + L[i - width] + L[i + width]) * 0.25;
          const diff = Math.abs(L[i] - localMean);
          sumNoise += diff;
          sumL += L[i];
          count++;
        }
      }
      if (count === 0) continue;
      const invCount = 1 / count;
      const meanGrad = sumGrad * invCount;
      const gradVar = sumGradSq * invCount - meanGrad * meanGrad;
      const coherence = meanGrad / (Math.sqrt(gradVar) + 1e-6);
      const noiseMean = sumNoise * invCount;
      const meanL = sumL * invCount;
      const S = meanGrad * coherence / (1 + noiseMean);
      const structureConfidence = S / (S + k + EPS2);
      const luminanceFactor = 0.6 + 0.4 * Math.sqrt(meanL);
      const localConfidence = structureConfidence * luminanceFactor;
      const tileAlpha = globalAlpha * (1 + strength * (localConfidence - 0.5));
      const clampedAlpha = Math.max(0.05, Math.min(2 * globalAlpha, tileAlpha));
      for (let y = ty; y < yEnd; y++) {
        const row = y * width;
        for (let x = tx; x < xEnd; x++) {
          alphaMap[row + x] = clampedAlpha;
        }
      }
    }
  }
  return alphaMap;
}
function computeControlMaps(L, width, height, globalAlpha, globalNoiseRatio, tileSize) {
  const { gx, gy } = computeGradient(L, width, height);
  const { edgeMap, structureMask, skinDampMap } = computeMaps(L, gx, gy, width, height);
  const localAlphaMap = computeLocalAlphaMap(L, gx, gy, width, height, globalAlpha, globalNoiseRatio, tileSize);
  const smoothLocalAlphaMap = blur_optimised_exports.guidedAlphaSmoothing(localAlphaMap, L, width, height);
  const Lsmall = blur_optimised_exports.smooth3x3(L, width, height);
  const Lmedium = blur_optimised_exports.smooth5x5(Lsmall, width, height);
  return {
    localAlphaMap,
    edgeMap,
    skinDampMap,
    structureMask,
    smoothLocalAlphaMap,
    Lsmall,
    Lmedium
  };
}

// src/controller/applyBlending_optimised.js
var LOG_LUT_SIZE = 4096;
var LOG_LUT = new Float32Array(LOG_LUT_SIZE);
for (let i = 0; i < LOG_LUT_SIZE; i++) {
  const x = i / (LOG_LUT_SIZE - 1);
  LOG_LUT[i] = Math.log(x + 1e-6);
}
function fastLog(x) {
  const idx = x * (LOG_LUT_SIZE - 1) | 0;
  if (idx >= 0 && idx < LOG_LUT_SIZE) return LOG_LUT[idx];
  return Math.log(x);
}
var POW_LUT_SIZE = 4096;
var POW07 = new Float32Array(POW_LUT_SIZE);
var POW08 = new Float32Array(POW_LUT_SIZE);
for (let i = 0; i < POW_LUT_SIZE; i++) {
  const x = i / (POW_LUT_SIZE - 1);
  POW07[i] = x ** 0.7;
  POW08[i] = x ** 0.8;
}
function pow07(x) {
  const idx = x * (POW_LUT_SIZE - 1) | 0;
  if (idx >= 0 && idx < POW_LUT_SIZE) return POW07[idx];
  return x ** 0.7;
}
function pow08(x) {
  const idx = x * (POW_LUT_SIZE - 1) | 0;
  if (idx >= 0 && idx < POW_LUT_SIZE) return POW08[idx];
  return x ** 0.8;
}
var EPS3 = 1e-6;
function applyBlending(L, Lclahe, width, height, maps, globalAlpha, perceptualParams) {
  const size = L.length;
  const Lenhanced = new Float32Array(size);
  const { lambda, beta, tau, edgeStabilizer } = perceptualParams;
  const edgeMap = maps.edgeMap;
  const skinDampMap = maps.skinDampMap;
  const structureMask = maps.structureMask;
  const Lsmall = maps.Lsmall;
  const Lmedium = maps.Lmedium;
  const alphaMap = maps.smoothLocalAlphaMap;
  const w = width;
  for (let y = 1; y < height - 1; y++) {
    let row = y * w;
    for (let x = 1; x < width - 1; x++) {
      const i = row + x;
      const Li = L[i];
      let a = alphaMap[i];
      if (a < 0) a = 0;
      else if (a > 1) a = 1;
      const finalAlpha = globalAlpha * (0.8 + 0.8 * a);
      const reflectance = fastLog(Lsmall[i]) - fastLog(Lmedium[i]);
      let detailMask = reflectance * 0.8 + 0.5;
      if (detailMask < 0) detailMask = 0;
      else if (detailMask > 1) detailMask = 1;
      const structureBoost = pow07(structureMask[i]);
      const localMean = (Lsmall[i - 1] + Lsmall[i + 1] + Lsmall[i - w] + Lsmall[i + w]) * 0.25;
      const edge = Math.abs(edgeMap[i]);
      const textureMask = edge / (edge + 0.015 + EPS3);
      let deltaDetail = (Lsmall[i] - localMean) * textureMask;
      if (deltaDetail < -0.25) deltaDetail = -0.25;
      else if (deltaDetail > 0.25) deltaDetail = 0.25;
      const deltaClahe = Lclahe[i] - Li;
      const edgeAdaptive = edge / (edge + 0.03 + EPS3);
      let delta = deltaClahe + 0.45 * deltaDetail * detailMask * skinDampMap[i] * structureBoost * edgeAdaptive;
      if (delta < -0.5) delta = -0.5;
      else if (delta > 0.5) delta = 0.5;
      const deltaStable = delta / (1 + 2 * Math.abs(delta) + EPS3);
      const deltaLimited = deltaStable / (1 + Math.abs(deltaStable) / (tau * (0.5 + Li)));
      const compressed = deltaLimited / (1 + lambda * Math.abs(deltaLimited));
      const kAdaptive = edgeStabilizer / (1 + finalAlpha);
      const edgeResponse = edge / (edge + kAdaptive + EPS3);
      const edgeGain = pow08(edgeResponse) * (1 + 0.6 * edgeResponse);
      let lumMask = 1 - beta * Li;
      if (lumMask < 0.15) lumMask = 0.15;
      const contrastGain = 1 + finalAlpha * (1 - 0.5 * Li);
      let enhanced = Li + compressed * edgeGain * lumMask * contrastGain;
      if (!Number.isFinite(enhanced))
        enhanced = Li;
      if (enhanced < 0) enhanced = 0;
      else if (enhanced > 1) enhanced = 1;
      Lenhanced[i] = enhanced;
    }
  }
  return Lenhanced;
}

// src/actuator/CLAHE.js
function buildTileLUTs(gray, w, h, tileSize, clipLimit) {
  const bins = 256;
  const tilesX = Math.ceil(w / tileSize);
  const tilesY = Math.ceil(h / tileSize);
  const luts = Array.from(
    { length: tilesY },
    () => Array.from({ length: tilesX }, () => new Uint8Array(bins))
  );
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const hist = new Uint32Array(bins);
      const x0 = tx * tileSize;
      const y0 = ty * tileSize;
      const x1 = Math.min(x0 + tileSize, w);
      const y1 = Math.min(y0 + tileSize, h);
      for (let y = y0; y < y1; y++) {
        const row = y * w;
        for (let x = x0; x < x1; x++) {
          hist[gray[row + x]]++;
        }
      }
      const tileArea = (x1 - x0) * (y1 - y0);
      const maxPerBin = Math.floor(clipLimit * tileArea);
      let excess = 0;
      for (let i = 0; i < bins; i++) {
        if (hist[i] > maxPerBin) {
          excess += hist[i] - maxPerBin;
          hist[i] = maxPerBin;
        }
      }
      const redist = Math.floor(excess / bins);
      const remainder = excess % bins;
      for (let i = 0; i < bins; i++) {
        hist[i] += redist;
      }
      for (let i = 0; i < remainder; i++) {
        hist[i]++;
      }
      let acc = 0;
      const scale = 255 / tileArea;
      for (let i = 0; i < bins; i++) {
        acc += hist[i];
        luts[ty][tx][i] = Math.min(255, Math.round(acc * scale));
      }
    }
  }
  return { luts, tilesX, tilesY };
}
function claheGrayBilinear(gray, w, h, tileSize, luts, tilesX, tilesY) {
  const out = new Uint8ClampedArray(gray.length);
  for (let y = 0; y < h; y++) {
    const gy = (y + 0.5) / tileSize - 0.5;
    let ty = Math.floor(gy);
    const fy = gy - ty;
    ty = Math.max(0, Math.min(ty, tilesY - 1));
    const ty1 = Math.min(ty + 1, tilesY - 1);
    for (let x = 0; x < w; x++) {
      const gx = (x + 0.5) / tileSize - 0.5;
      let tx = Math.floor(gx);
      const fx = gx - tx;
      tx = Math.max(0, Math.min(tx, tilesX - 1));
      const tx1 = Math.min(tx + 1, tilesX - 1);
      const g = gray[y * w + x];
      const v_tl = luts[ty][tx][g];
      const v_tr = luts[ty][tx1][g];
      const v_bl = luts[ty1][tx][g];
      const v_br = luts[ty1][tx1][g];
      const w_tl = (1 - fx) * (1 - fy);
      const w_tr = fx * (1 - fy);
      const w_bl = (1 - fx) * fy;
      const w_br = fx * fy;
      out[y * w + x] = v_tl * w_tl + v_tr * w_tr + v_bl * w_bl + v_br * w_br;
    }
  }
  return out;
}
function applyCLAHE(Lfloat, width, height, tileSize, clipLimit) {
  const size = width * height;
  const L = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    let v = Lfloat[i] * 255;
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    L[i] = v | 0;
  }
  const { luts, tilesX, tilesY } = buildTileLUTs(L, width, height, tileSize, clipLimit);
  const Leq = claheGrayBilinear(
    L,
    width,
    height,
    tileSize,
    luts,
    tilesX,
    tilesY
  );
  const Lout = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    Lout[i] = Leq[i] / 255;
  }
  return Lout;
}

// src/createContext.js
function createContext(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const totalPixels = width * height;
  return {
    meta: {
      width,
      height,
      totalPixels
    },
    image: {
      input: imageData,
      // ImageData
      working: {
        L: null,
        // Float32Array, All pixel processing happens on it
        A: null,
        // Float32Array
        B: null
        // Float32Array
      },
      output: null
      // Uint8ClampedArray
    },
    stats: {},
    // filled by stats layers
    params: {},
    // Generated by controller's adaptiveparams layers
    maps: {},
    // Generated by controller's map layers
    buffers: {},
    // For intermediate calculations
    metrics: {},
    // stageName: runtime(ms)
    runtime: {
      // Used for progress bar and debugging
      stage: "",
      progressPercent: 0,
      stages: 0,
      prevStage: ""
    }
  };
}

// src/PACE.js
var stage1 = (ctx) => {
  const data = ctx.image.input.data;
  const debug = ctx.options.debug;
  const Lab = colorSpaceConversion_exports.rgbToOklabPlanes(data);
  Object.assign(ctx.image.working, {
    L: Lab.L,
    A: Lab.a,
    B: Lab.b
  });
  debug && debug_exports.log("Stage 1: Color Conversion", "RGB \u2192 Oklab", {
    input: {
      RGBA: debug_exports.preview(data)
    },
    output: {
      L: debug_exports.preview(Lab.L),
      A: debug_exports.preview(Lab.a),
      B: debug_exports.preview(Lab.b)
    }
  });
  return ctx;
};
var stage2 = (ctx) => {
  const { L } = ctx.image.working;
  const { width, height } = ctx.meta;
  const debug = ctx.options.debug;
  const features = extractGlobalFeatures(L, width, height);
  ctx.stats = features;
  debug && debug_exports.log("Stage 2: Feature Extraction", "Extract Global Features", {
    input: {
      L: debug_exports.preview(L),
      width,
      height
    },
    output: {
      features
    }
  });
  return ctx;
};
var stage3 = (ctx) => {
  const features = ctx.stats;
  const debug = ctx.options.debug;
  const { controlParams, perceptualParams } = computeAdaptiveParams(features);
  if (ctx.options.override) {
    Object.assign(controlParams, ctx.options.override.controlParams || {});
    Object.assign(perceptualParams, ctx.options.override.perceptualParams || {});
  }
  Object.assign(ctx.params, {
    controlParams,
    perceptualParams
  });
  debug && debug_exports.log("Stage 3: Compute Adaptive Params", "Adaptive Control", {
    input: {
      features
    },
    output: {
      controlParams,
      perceptualParams
    }
  });
  return ctx;
};
var stage4 = (ctx) => {
  const { L } = ctx.image.working;
  const { width, height } = ctx.meta;
  const { tileSize, clipLimit } = ctx.params.controlParams;
  const debug = ctx.options.debug;
  const Lclahe = applyCLAHE(L, width, height, tileSize, clipLimit);
  ctx.buffers.Lclahe = Lclahe;
  debug && debug_exports.log("Stage 4: Apply CLAHE", "CLAHE Enhancement", {
    input: {
      L: debug_exports.preview(L),
      width,
      height
    },
    params: {
      tileSize,
      clipLimit
    },
    output: {
      Lclahe: debug_exports.preview(Lclahe)
    }
  });
  return ctx;
};
var stage5 = (ctx) => {
  const { L } = ctx.image.working;
  const { width, height } = ctx.meta;
  const { tileSize, globalAlpha } = ctx.params.controlParams;
  const globalNoiseRatio = ctx.stats.noise.noiseRatio;
  const debug = ctx.options.debug;
  const maps = maps_optimized_exports.computeControlMaps(L, width, height, globalAlpha, globalNoiseRatio, tileSize);
  ctx.maps = maps;
  debug && debug_exports.log("Stage 5: Compute Maps", "Compute Control Maps", {
    input: {
      L: debug_exports.preview(L),
      width,
      height
    },
    params: {
      globalAlpha,
      globalNoiseRatio,
      tileSize
    },
    output: {
      maps: Object.fromEntries(
        Object.entries(maps).map(([k, v]) => [k, debug_exports.preview(v)])
      )
    }
  });
  return ctx;
};
var stage6 = (ctx) => {
  const { L } = ctx.image.working;
  const { Lclahe } = ctx.buffers;
  const { width, height } = ctx.meta;
  const { maps } = ctx;
  const { globalAlpha } = ctx.params.controlParams;
  const { perceptualParams } = ctx.params;
  const debug = ctx.options.debug;
  let Lenhanced = applyBlending(
    L,
    Lclahe,
    width,
    height,
    maps,
    globalAlpha,
    perceptualParams
  );
  const strength = ctx.options.strength ?? 1;
  if (strength !== 1) {
    const len = Lenhanced.length;
    for (let i = 0; i < len; i++) {
      Lenhanced[i] = L[i] + (Lenhanced[i] - L[i]) * strength;
    }
  }
  ctx.buffers.Lenhanced = Lenhanced;
  debug && debug_exports.log("Stage 6: Blending", "Final Enhancement", {
    input: {
      L: debug_exports.preview(L),
      Lclahe: debug_exports.preview(Lclahe),
      maps: Object.fromEntries(
        Object.entries(maps).map(([k, v]) => [k, debug_exports.preview(v)])
      ),
      width,
      height
    },
    params: {
      globalAlpha,
      perceptualParams
    },
    output: {
      Lenhanced: debug_exports.preview(Lenhanced)
    }
  });
  return ctx;
};
var stage7 = (ctx) => {
  const { Lenhanced } = ctx.buffers;
  const { A, B } = ctx.image.working;
  const { width, height } = ctx.meta;
  const debug = ctx.options.debug;
  const newRGB = colorSpaceConversion_exports.oklabPlanesToRgb(Lenhanced, A, B);
  ctx.image.output = new ImageData(newRGB, width, height);
  debug && debug_exports.log("Stage 7: Reconstruction", "Oklab \u2192 RGB", {
    input: {
      Lenhanced: debug_exports.preview(Lenhanced),
      A: debug_exports.preview(A),
      B: debug_exports.preview(B),
      width,
      height
    },
    output: {
      newRGBA: debug_exports.preview(newRGB)
    },
    end: true
  });
  return ctx;
};
var PIPELINE = [
  { name: "Extract Color", run: stage1 },
  { name: "Extract Stats", run: stage2 },
  { name: "Compute Params", run: stage3 },
  { name: "CLAHE", run: stage4 },
  { name: "Compute Maps", run: stage5 },
  { name: "Blending", run: stage6 },
  { name: "Reconstruct", run: stage7 }
];
var runPipeline = async (pipeline, ctx, onProgress) => {
  const totalStages = pipeline.length;
  Object.assign(ctx.runtime, {
    stage: "init",
    progressPercent: 0,
    stages: totalStages,
    prevStage: "init"
  });
  if (onProgress) {
    onProgress({
      stage: "init",
      index: 0,
      total: totalStages,
      time: 0,
      progressPercent: 0
    });
  }
  for (let i = 0; i < totalStages; i++) {
    const { name, run } = pipeline[i];
    const prevStage = ctx.runtime.stage;
    ctx.runtime.stage = name;
    const start = performance.now();
    try {
      ctx = await run(ctx);
    } catch (err) {
      console.error(`Pipeline failed at stage: ${name}`);
      throw err;
    }
    const time = performance.now() - start;
    const progressPercent = (i + 1) / totalStages * 100;
    ctx.metrics[name] = time;
    Object.assign(ctx.runtime, {
      stage: name,
      prevStage,
      progressPercent
    });
    if (onProgress) {
      onProgress({
        stage: name,
        index: i + 1,
        total: totalStages,
        time,
        progressPercent
      });
    }
  }
  return ctx;
};
async function applyPACE(imageData, options = {}, onProgress) {
  const ctx = createContext(imageData);
  ctx.options = {
    debug: false,
    strength: 1,
    override: null,
    ...options
  };
  await runPipeline(PIPELINE, ctx, onProgress);
  return ctx.image.output;
}

// src/index.js
var PACE = {
  enhance: applyPACE,
  applyPACE
};
export {
  PACE,
  applyPACE
};
