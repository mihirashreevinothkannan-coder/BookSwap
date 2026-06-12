import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { register as apiRegister } from "../api/auth";
import { notify } from "../lib/toast";

// =========================================================================
//  Register — create a new account
// =========================================================================
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return notify.error("Please fill in every field");
    if (password.length < 6) return notify.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await apiRegister(name, email, password);
      notify.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      // A duplicate email is the most common failure.
      const msg = err?.response?.status === 500
        ? "That email may already be registered"
        : "Registration failed. Try again.";
      notify.error(msg);
    } finally {
      setLoading(false);
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
          <form onSubmit={handleRegister}>
            <h2 style={{ marginBottom: 6 }}>Create your account</h2>
            <p style={{ marginBottom: 24 }}>Start swapping books in minutes.</p>

            <div className="field">
              <label className="label">Full name</label>
              <div style={{ position: "relative" }}>
                <FiUser style={iconStyle} />
                <input className="input" style={{ paddingLeft: 40 }} placeholder="Ada Lovelace"
                  value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div style={{ position: "relative" }}>
                <FiMail style={iconStyle} />
                <input className="input" style={{ paddingLeft: 40 }} type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <FiLock style={iconStyle} />
                <input className="input" style={{ paddingLeft: 40 }} type="password" placeholder="At least 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" block disabled={loading} className="btn-primary">
              {loading ? "Creating…" : <>Create account <FiArrowRight /></>}
            </Button>

            <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0 }}>
              Already have an account?{" "}
              <Link to="/login" className="text-gradient" style={{ fontWeight: 600 }}>Sign in</Link>
            </p>
          </form>
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
