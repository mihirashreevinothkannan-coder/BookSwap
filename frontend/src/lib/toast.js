// =========================================================================
//  Toast helpers — thin wrapper over react-hot-toast with on-theme styling.
//  Use:  import { notify } from "../lib/toast";  notify.success("Saved!");
// =========================================================================
import toast from "react-hot-toast";

const base = {
  style: {
    background: "rgba(17, 19, 31, 0.92)",
    color: "#e8eaf0",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    backdropFilter: "blur(12px)",
    fontSize: "0.92rem",
  },
};

export const notify = {
  success: (msg) =>
    toast.success(msg, { ...base, iconTheme: { primary: "#34d399", secondary: "#06070d" } }),
  error: (msg) =>
    toast.error(msg, { ...base, iconTheme: { primary: "#f87171", secondary: "#06070d" } }),
  info: (msg) => toast(msg, base),
};

export { toast };
