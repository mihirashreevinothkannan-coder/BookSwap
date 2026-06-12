import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiSearch,
  FiRepeat,
  FiHeart,
  FiShield,
  FiZap,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

// =========================================================================
//  Landing — public marketing page (route "/")
// =========================================================================

const features = [
  { icon: <FiSearch />, title: "Discover", text: "Browse a living library of books shared by readers near you." },
  { icon: <FiRepeat />, title: "Swap & borrow", text: "Send a request, agree a swap, and pass great books along." },
  { icon: <FiHeart />, title: "Wishlist", text: "Save the titles you want and grab them the moment they appear." },
  { icon: <FiShield />, title: "Secure login", text: "Email OTP verification keeps your account safe." },
  { icon: <FiZap />, title: "Fast & simple", text: "A clean, distraction-free experience built for reading, not friction." },
  { icon: <FiUsers />, title: "Community", text: "Track requests, lending and returns all in one place." },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <main style={{ flex: 1 }}>
      <div className="container" style={{ paddingBlock: "clamp(48px, 10vw, 120px)" }}>
        {/* ---- Hero ---- */}
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <motion.span
            className="chip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 20 }}
          >
            ✨ Read more. Spend less.
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ marginTop: 16 }}
          >
            Swap the books you've read for the{" "}
            <span className="text-gradient">ones you crave</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{ fontSize: "1.15rem", maxWidth: 560, margin: "0 auto 32px" }}
          >
            BookSwap is a community library in your pocket — list your shelf,
            discover new reads, and trade them with people around you.
          </motion.p>

          <motion.div
            className="row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{ justifyContent: "center" }}
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn btn-primary">
              Get started <FiArrowRight />
            </Link>
            <Link to="/browse-books" className="btn btn-outline">
              Browse books
            </Link>
          </motion.div>
        </div>

        {/* ---- Feature grid ---- */}
        <div className="grid-cards" style={{ marginTop: 72 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card card-hover stack"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="empty-icon" style={{ width: 48, height: 48, fontSize: "1.2rem", marginBottom: 4 }}>
                {f.icon}
              </div>
              <h3 style={{ margin: 0 }}>{f.title}</h3>
              <p style={{ margin: 0 }}>{f.text}</p>
            </motion.div>
          ))}
        </div>

        {/* ---- CTA ---- */}
        <div className="card" style={{ marginTop: 64, textAlign: "center", padding: "48px 24px" }}>
          <h2>Ready to clear your shelf?</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 24px" }}>
            Join BookSwap and turn the books you've finished into the next great read.
          </p>
          <Link to="/register" className="btn btn-primary">
            Create your free account <FiArrowRight />
          </Link>
        </div>
      </div>
    </main>
  );
}
