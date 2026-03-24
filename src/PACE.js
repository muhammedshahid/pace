/**
 * applyPACE
 * --------------------------------------------
 * Applies PACE (Perceptual Adaptive Contrast Enhancement)
 * to an input image using an adaptive, perception-driven pipeline.
 *
 * The algorithm automatically analyzes image statistics and tunes
 * enhancement parameters without manual intervention.
 *
 * Pipeline Stages:
 * 1. Color space conversion (RGB → Oklab)
 * 2. Global feature extraction
 * 3. Adaptive parameter computation
 * 4. Local contrast enhancement (CLAHE)
 * 5. Control map generation
 * 6. Perceptual blending
 * 7. Reconstruction (Oklab → RGB)
 *
 * --------------------------------------------
 * @param {ImageData} imageData
 * Input image in RGBA format.
 *
 * @param {Object} [options]
 * Optional configuration object.
 *
 * @param {boolean} [options.debug=false]
 * Enables detailed debugging logs for each pipeline stage.
 * Outputs summarized input, parameters, and results to console.
 * Also generates downloadable trace (if enabled internally).
 *
 * @param {number} [options.strength=1.0]
 * Controls overall enhancement intensity.
 * - 0.0 → no enhancement (original image)
 * - 1.0 → full PACE enhancement (default)
 * - >1.0 → stronger enhancement (may amplify noise)
 *
 * @param {Object|null} [options.override=null]
 * Allows manual override of automatically computed parameters.
 * Useful for experimentation and research reproducibility.
 *
 * @param {Object} [options.override.controlParams]
 * Overrides control parameters (e.g., tileSize, clipLimit, globalAlpha).
 *
 * @param {Object} [options.override.perceptualParams]
 * Overrides perceptual blending parameters (e.g., lambda, beta, tau, edgeStabilizer).
 *
 * --------------------------------------------
 * @param {Function} [onProgress]
 * Optional callback to track pipeline execution progress.
 *
 * @param {Object} onProgress.info
 * @param {string} onProgress.info.stage - Current stage name
 * @param {number} onProgress.info.index - Current stage index
 * @param {number} onProgress.info.total - Total stages
 * @param {number} onProgress.info.time - Execution time (ms)
 * @param {number} onProgress.info.progressPercent - Completion %
 *
 * --------------------------------------------
 * @returns {Promise<ImageData>}
 * Enhanced image as ImageData object.
 *
 * --------------------------------------------
 * @example
 * const enhanced = await applyPACE(imageData);
 *
 * @example
 * const enhanced = await applyPACE(imageData, {
 *   debug: true,
 *   strength: 0.8
 * });
 *
 * @example
 * const enhanced = await applyPACE(imageData, {
 *   override: {
 *     controlParams: { clipLimit: 2.0 },
 *     perceptualParams: { tau: 0.5 }
 *   }
 * });
 *
 * --------------------------------------------
 * @author
 * PACE Framework by Mohd. Shahid
 *
 * --------------------------------------------
 */

import * as Utils from "./utils/index.js";
import * as Stats from "./stats/index.js";
import * as Controller from "./controller/index.js";
import * as Actuator from "./actuator/index.js";
import { createContext } from "./createContext.js";

const stage1 = (ctx) => {
    const data = ctx.image.input.data;
    const debug = ctx.options.debug;

    const Lab = Utils.colorSpaceConversion.rgbToOklabPlanes(data);

    Object.assign(ctx.image.working, {
        L: Lab.L,
        A: Lab.a,
        B: Lab.b
    });

    debug && Utils.debug.log("Stage 1: Color Conversion", "RGB → Oklab", {
        input: {
            RGBA: Utils.debug.preview(data)
        },
        output: {
            L: Utils.debug.preview(Lab.L),
            A: Utils.debug.preview(Lab.a),
            B: Utils.debug.preview(Lab.b)
        }
    });
    return ctx;
};

const stage2 = (ctx) => {
    const { L } = ctx.image.working;
    const { width, height } = ctx.meta;
    const debug = ctx.options.debug;

    const features = Stats.extractGlobalFeatures(L, width, height);
    ctx.stats = features;

    debug && Utils.debug.log("Stage 2: Feature Extraction", "Extract Global Features", {
        input: {
            L: Utils.debug.preview(L),
            width,
            height
        },
        output: {
            features: features
        }
    });

    return ctx;
}

const stage3 = (ctx) => {
    const features = ctx.stats;
    const debug = ctx.options.debug;

    const { controlParams, perceptualParams } = Controller.computeAdaptiveParams(features);

    // Apply override if provided
    if (ctx.options.override) {
        Object.assign(controlParams, ctx.options.override.controlParams || {});
        Object.assign(perceptualParams, ctx.options.override.perceptualParams || {});
    }

    Object.assign(ctx.params, {
        controlParams,
        perceptualParams
    });

    debug && Utils.debug.log("Stage 3: Compute Adaptive Params", "Adaptive Control", {
        input: {
            features: features
        },
        output: {
            controlParams,
            perceptualParams
        }
    });

    return ctx;
}

const stage4 = (ctx) => {
    const { L } = ctx.image.working;
    const { width, height } = ctx.meta;
    const { tileSize, clipLimit } = ctx.params.controlParams;
    const debug = ctx.options.debug;

    const Lclahe = Actuator.applyCLAHE(L, width, height, tileSize, clipLimit);

    ctx.buffers.Lclahe = Lclahe;

    debug && Utils.debug.log("Stage 4: Apply CLAHE", "CLAHE Enhancement", {
        input: {
            L: Utils.debug.preview(L),
            width,
            height
        },
        params: {
            tileSize,
            clipLimit
        },
        output: {
            Lclahe: Utils.debug.preview(Lclahe)
        }
    });

    return ctx;
}

const stage5 = (ctx) => {
    const { L } = ctx.image.working;
    const { width, height } = ctx.meta;
    const { tileSize, globalAlpha } = ctx.params.controlParams;
    const globalNoiseRatio = ctx.stats.noise.noiseRatio;
    const debug = ctx.options.debug;

    const maps = Controller.maps.computeControlMaps(L, width, height, globalAlpha, globalNoiseRatio, tileSize);

    ctx.maps = maps;

    debug && Utils.debug.log("Stage 5: Compute Maps", "Compute Control Maps", {
        input: {
            L: Utils.debug.preview(L),
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
                Object.entries(maps).map(([k, v]) => [k, Utils.debug.preview(v)])
            )
        }
    });

    return ctx;
}

const stage6 = (ctx) => {
    const { L } = ctx.image.working;
    const { Lclahe } = ctx.buffers;
    const { width, height } = ctx.meta;
    const { maps } = ctx;
    const { globalAlpha } = ctx.params.controlParams;
    const { perceptualParams } = ctx.params;
    const debug = ctx.options.debug;

    let Lenhanced = Controller.applyBlending(
        L, Lclahe, width, height, maps, globalAlpha, perceptualParams
    );

    // Apply strength scaling (post-blending control)
    const strength = ctx.options.strength ?? 1.0;

    if (strength !== 1.0) {
        const len = Lenhanced.length;
        for (let i = 0; i < len; i++) {
            Lenhanced[i] = L[i] + (Lenhanced[i] - L[i]) * strength;
        }
    }

    ctx.buffers.Lenhanced = Lenhanced;

    debug && Utils.debug.log("Stage 6: Blending", "Final Enhancement", {
        input: {
            L: Utils.debug.preview(L),
            Lclahe: Utils.debug.preview(Lclahe),
            maps: Object.fromEntries(
                Object.entries(maps).map(([k, v]) => [k, Utils.debug.preview(v)])
            ),
            width,
            height
        },
        params: {
            globalAlpha,
            perceptualParams
        },
        output: {
            Lenhanced: Utils.debug.preview(Lenhanced)
        }
    });

    return ctx;
}

const stage7 = (ctx) => {
    const { Lenhanced } = ctx.buffers;
    const { A, B } = ctx.image.working;
    const { width, height } = ctx.meta;
    const debug = ctx.options.debug;

    const newRGB = Utils.colorSpaceConversion.oklabPlanesToRgb(Lenhanced, A, B);
    ctx.image.output = new ImageData(newRGB, width, height);

    debug && Utils.debug.log("Stage 7: Reconstruction", "Oklab → RGB", {
        input: {
            Lenhanced: Utils.debug.preview(Lenhanced),
            A: Utils.debug.preview(A),
            B: Utils.debug.preview(B),
            width,
            height
        },
        output: {
            newRGBA: Utils.debug.preview(newRGB)
        },
        end: true
    });

    return ctx;
}

const PIPELINE = [
    { name: "Extract Color", run: stage1 },
    { name: "Extract Stats", run: stage2 },
    { name: "Compute Params", run: stage3 },
    { name: "CLAHE", run: stage4 },
    { name: "Compute Maps", run: stage5 },
    { name: "Blending", run: stage6 },
    { name: "Reconstruct", run: stage7 }
];

const runPipeline = async (pipeline, ctx, onProgress) => {
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

        const progressPercent = ((i + 1) / totalStages) * 100;
        ctx.metrics[name] = time;

        Object.assign(ctx.runtime, {
            stage: name,
            prevStage: prevStage,
            progressPercent: progressPercent
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

export async function applyPACE(imageData, options = {}, onProgress) {
    const ctx = createContext(imageData);
    // Inject options with defaults
    ctx.options = {
        debug: false,
        strength: 1.0,
        override: null,
        ...options
    };
    await runPipeline(PIPELINE, ctx, onProgress);

    return ctx.image.output;
}