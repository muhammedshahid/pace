import { applyPACE } from "./PACE.js";

const PACE = {
  enhance: applyPACE
};

// ES module export (for Node / bundlers)
export { applyPACE };
export default PACE;

// Browser global (for CDN usage)
if (typeof window !== "undefined") {
  window.PACE = PACE;
}