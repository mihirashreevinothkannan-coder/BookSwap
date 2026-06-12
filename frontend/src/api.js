// Backwards-compatible re-export. The configured axios instance now lives in
// api/client.js; this keeps any old `import api from "../api"` working.
export { default } from "./api/client";
