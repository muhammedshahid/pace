import { applyPACE } from "../dist/pace.esm.js";

self.onmessage = async (e) => {
    const { imgData, options } = e.data;

    try {
        const result = await applyPACE(imgData, options, (progress) => {
            self.postMessage({ type: 'PROGRESS', data: progress });
        });

        // zero-copy performance
        self.postMessage({ type: 'DONE', data: result }, [result.data.buffer]);
    } catch (error) {
        self.postMessage({ type: 'ERROR', error: error.message });
    }
};