import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiCalendar, FiLogOut, FiBook, FiRepeat, FiHeart } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getMyBooks, getBorrowedBooks } from "../api/books";
import { getWishlist } from "../lib/localStore";
import { notify } from "../lib/toast";

// =========================================================================
//  Profile — account overview + sign out
// =========================================================================
export default function Profile() {
  const { user, userId, logout } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ books: "—", borrowed: "—", wishlist: getWishlist(userId).length });

  useEffect(() => {
    (async () => {
      const [books, borrowed] = await Promise.all([
        getMyBooks(userId).catch(() => []),
        getBorrowedBooks(userId).catch(() => []),
      ]);
      setCounts({ books: books.length, borrowed: borrowed.length, wishlist: getWishlist(userId).length });
    })();
  }, [userId]);

  const handleLogout = () => {
    logout();
    notify.success("Logged out");
    navigate("/login");
  };

  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—";

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>Profile</h1>
        <p>Your account at a glance.</p>
      </div>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)", alignItems: "start" }}>
        {/* Identity card */}
        <Card className="stack" style={{ alignItems: "center", textAlign: "center" }}>
          <span
            style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--grad)", color: "#06070d",
              display: "grid", placeItems: "center", fontSize: "2rem", fontWeight: 700, boxShadow: "var(--glow-purple)" }}
          >
            {(user?.name || "?").charAt(0).toUpperCase()}
          </span>
          <h2 style={{ margin: 0 }}>{user?.name}</h2>
          <span className="row text-dim" style={{ gap: 6, fontSize: "0.9rem" }}><FiMail size={14} /> {user?.email}</span>
          <span className="row text-muted" style={{ gap: 6, fontSize: "0.82rem" }}><FiCalendar size={13} /> Joined {joined}</span>
          <Button variant="danger" block onClick={handleLogout} style={{ marginTop: 8 }}>
            <FiLogOut /> Sign out
          </Button>
        </Card>

        {/* Stats */}
        <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          <StatCard icon={<FiBook />} value={counts.books} label="Books shared" color="var(--blue)" />
          <StatCard icon={<FiRepeat />} value={counts.borrowed} label="Borrowed" color="var(--cyan)" />
          <StatCard icon={<FiHeart />} value={counts.wishlist} label="Wishlist" color="var(--pink)" />
        </div>
      </div>
    </FadeIn>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <Card className="stat" hover>
      <div className="row-between">
        <span className="stat-value" style={{ color }}>{value}</span>
        <span style={{ color, fontSize: "1.3rem" }}>{icon}</span>
      </div>
      <span className="stat-label">{label}</span>
    </Card>
  );
}
