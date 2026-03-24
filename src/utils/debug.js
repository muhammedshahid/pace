// ./generalPurpose.js
export const preview = (arr, n = 10) => ({
    sample: arr.slice(0, n),
    length: arr.length
});

let __PACE_TRACE__ = {
    meta: {},
    stages: []
};

let __STAGE_INDEX__ = 0;
let __LAST_TIME__ = performance.now();
let __SESSION_ID__ = `pace-${Date.now()}`;

export const log = async (stage, label, payload = {}) => {
    // FINALIZE & DOWNLOAD
    if (payload.end) {
        const json = JSON.stringify(__PACE_TRACE__, null, 2);
        const filename = `pace-trace-${__SESSION_ID__}.json`;

        // BROWSER ENVIRONMENT
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

                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (e) {
                console.warn("Browser download failed");
            }
        }

        // NODE.JS ENVIRONMENT
        else if (typeof process !== "undefined" && process.versions?.node) {
            try {
                const fs = await import("fs");
                fs.writeFileSync(filename, json);
                console.log(`📁 Trace saved: ${filename}`);
            } catch (e) {
                console.error("Node file write failed:", e);
            }
        }

        // RESET
        __PACE_TRACE__ = { meta: {}, stages: [] };
        __STAGE_INDEX__ = 0;
        __LAST_TIME__ = performance.now();
        __SESSION_ID__ = `pace-${Date.now()}`;

        return json; // always return
    }

    const now = performance.now();
    const duration = now - __LAST_TIME__;
    __LAST_TIME__ = now;

    __STAGE_INDEX__++;

    // STORE TRACE
    __PACE_TRACE__.stages.push({
        stage,
        label,
        index: __STAGE_INDEX__,
        timestamp: new Date().toISOString(),
        duration: Number(duration.toFixed(3)), // ms
        ...(payload.input && { input: payload.input }),
        ...(payload.params && { params: payload.params }),
        ...(payload.output && { output: payload.output })
    });

    // Capture meta once (if available)
    if (!__PACE_TRACE__.meta.image && payload.input?.width && payload.input?.height) {
        __PACE_TRACE__.meta.image = {
            width: payload.input.width,
            height: payload.input.height
        };
    }

    // CONSOLE DEBUG
    console.groupCollapsed(
        `🟦 [PACE] ${__STAGE_INDEX__}. ${stage} → ${label} (${duration.toFixed(2)} ms)`
    );

    if (payload.input) console.log("🔹 Input:", payload.input);
    if (payload.params) console.log("⚙️ Params:", payload.params);
    if (payload.output) console.log("🟢 Output:", payload.output);

    console.groupEnd();
};