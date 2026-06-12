import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiArrowLeft, FiShield } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin, sendOtp, verifyOtp } from "../api/auth";
import { notify } from "../lib/toast";

// =========================================================================
//  Login — two-step flow with email OTP verification
//  -----------------------------------------------------------------------
//  Step 1: verify email + password (credentials checked, NOT yet signed in)
//  Step 2: enter the 6-digit code emailed to the user, then sign in.
//
//  Designed never to crash: every network call is wrapped, and while the
//  backend is in dev mode it returns the code so you can test without Gmail.
// =========================================================================

export default function Login() {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [devHint, setDevHint] = useState(""); // shows the code in dev mode
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  // ---- Step 1: check credentials, then send OTP --------------------------
  const handleCredentials = async (e) => {
    e.preventDefault();
    if (!email || !password) return notify.error("Enter your email and password");

    setLoading(true);
    try {
      // 1) Verify email + password with the existing /login endpoint.
      const user = await apiLogin(email, password);
      setPendingUser(user);

      // 2) Trigger the OTP email. If the backend can't email (dev mode), it
      //    returns devCode so we can still verify.
      try {
        const res = await sendOtp(email);
        if (res.devCode) {
          setDevHint(res.devCode);
          setCode(res.devCode); // auto-fill for convenience while testing
          notify.info(`Dev mode: your code is ${res.devCode}`);
        } else {
          notify.success("Verification code sent to your email");
        }
      } catch {
        // Sending failed but credentials were valid — let the user retry.
        notify.error("Could not send the code. Tap Resend to try again.");
      }

      setStep("otp");
    } catch {
      notify.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 2: verify the OTP, then sign in ------------------------------
  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.trim().length < 6) return notify.error("Enter the 6-digit code");

    setLoading(true);
    try {
      await verifyOtp(email, code.trim());
      login(pendingUser); // persists to localStorage via AuthContext
      notify.success(`Welcome back, ${pendingUser?.name || "reader"}!`);
      navigate(redirectTo, { replace: true });
    } catch {
      notify.error("Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const res = await sendOtp(email);
      if (res.devCode) {
        setDevHint(res.devCode);
        setCode(res.devCode);
      }
      notify.success("A new code is on its way");
    } catch {
      notify.error("Could not resend the code");
    }
  };

  return (
    <div className="auth-wrap">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Link to="/" className="brand" style={{ justifyContent: "center", fontSize: "1.4rem" }}>
            <span className="brand-mark">📚</span>
            Book<span className="text-gradient">Swap</span>
          </Link>
        </div>

        <Card>
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              // ----------------------------- STEP 1 -----------------------
              <motion.form
                key="credentials"
                onSubmit={handleCredentials}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ marginBottom: 6 }}>Welcome back</h2>
                <p style={{ marginBottom: 24 }}>Sign in to continue to BookSwap.</p>

                <div className="field">
                  <label className="label">Email</label>
                  <div style={{ position: "relative" }}>
                    <FiMail style={iconStyle} />
                    <input
                      className="input"
                      style={{ paddingLeft: 40 }}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div style={{ position: "relative" }}>
                    <FiLock style={iconStyle} />
                    <input
                      className="input"
                      style={{ paddingLeft: 40 }}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" block disabled={loading} className="btn-primary">
                  {loading ? "Checking…" : <>Continue <FiArrowRight /></>}
                </Button>

                <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0 }}>
                  New here? <Link to="/register" className="text-gradient" style={{ fontWeight: 600 }}>Create an account</Link>
                </p>
              </motion.form>
            ) : (
              // ----------------------------- STEP 2 -----------------------
              <motion.form
                key="otp"
                onSubmit={handleVerify}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="empty-icon" style={{ margin: "0 auto 16px" }}>
                  <FiShield />
                </div>
                <h2 style={{ textAlign: "center", marginBottom: 6 }}>Verify it's you</h2>
                <p style={{ textAlign: "center", marginBottom: 4 }}>
                  We sent a 6-digit code to
                </p>
                <p style={{ textAlign: "center", color: "var(--cyan)", fontWeight: 600, marginBottom: 24 }}>
                  {email}
                </p>

                {devHint && (
                  <div className="chip" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}>
                    🔧 Dev mode code: <strong style={{ color: "#fff" }}>{devHint}</strong>
                  </div>
                )}

                <input
                  className="input"
                  style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: "1.4rem", fontWeight: 700 }}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />

                <Button type="submit" block disabled={loading} className="btn-primary" style={{ marginTop: 16 }}>
                  {loading ? "Verifying…" : <>Verify & sign in <FiArrowRight /></>}
                </Button>

                <div className="row-between" style={{ marginTop: 16 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep("credentials")}>
                    <FiArrowLeft /> Back
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={resend}>
                    Resend code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}

const iconStyle = {
  position: "absolute",
  left: 13,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-muted)",
};
