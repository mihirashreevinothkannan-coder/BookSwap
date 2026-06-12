import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBook, FiRepeat, FiInbox, FiHeart, FiPlusCircle, FiSearch, FiArrowRight } from "react-icons/fi";

import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import FadeIn from "../components/ui/FadeIn";
import { useAuth } from "../context/AuthContext";
import { getMyBooks, getBorrowedBooks } from "../api/books";
import { getReceivedRequests } from "../api/requests";
import { getWishlist } from "../lib/localStore";

// =========================================================================
//  Dashboard — at-a-glance stats + quick actions
// =========================================================================
export default function Dashboard() {
  const { user, userId } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Fetch everything in parallel; tolerate individual failures.
        const [myBooks, borrowed, received] = await Promise.all([
          getMyBooks(userId).catch(() => []),
          getBorrowedBooks(userId).catch(() => []),
          getReceivedRequests(userId).catch(() => []),
        ]);
        if (!active) return;
        setStats({
          myBooks: myBooks.length,
          borrowed: borrowed.length,
          pending: received.filter((r) => r.status === "PENDING").length,
          wishlist: getWishlist(userId).length,
        });
      } catch {
        if (active) setStats({ myBooks: 0, borrowed: 0, pending: 0, wishlist: 0 });
      }
    })();
    return () => { active = false; };
  }, [userId]);

  const tiles = stats && [
    { label: "My Books", value: stats.myBooks, icon: <FiBook />, to: "/my-books", color: "var(--blue)" },
    { label: "Borrowed", value: stats.borrowed, icon: <FiRepeat />, to: "/borrowed-books", color: "var(--cyan)" },
    { label: "Pending Requests", value: stats.pending, icon: <FiInbox />, to: "/my-requests", color: "var(--amber)" },
    { label: "Wishlist", value: stats.wishlist, icon: <FiHeart />, to: "/wishlist", color: "var(--pink)" },
  ];

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>
          Welcome back, <span className="text-gradient">{user?.name || "reader"}</span> 👋
        </h1>
        <p>Here's what's happening across your shelf today.</p>
      </div>

      {/* Stat tiles */}
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><Skeleton h={28} w="40%" /><Skeleton h={14} w="60%" style={{ marginTop: 12 }} /></Card>
            ))
          : tiles.map((t, i) => (
              <motion.div key={t.label} whileHover={{ y: -4 }}>
                <Link to={t.to}>
                  <Card hover className="stat" style={{ cursor: "pointer" }}>
                    <div className="row-between">
                      <span className="stat-value" style={{ color: t.color }}>{t.value}</span>
                      <span style={{ color: t.color, fontSize: "1.4rem" }}>{t.icon}</span>
                    </div>
                    <span className="stat-label">{t.label}</span>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ marginTop: 48 }}>Quick actions</h2>
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        <QuickAction to="/add-book" icon={<FiPlusCircle />} title="List a book" text="Add a book from your shelf for others to borrow." />
        <QuickAction to="/browse-books" icon={<FiSearch />} title="Find a read" text="Browse books shared by the community." />
        <QuickAction to="/my-requests" icon={<FiInbox />} title="Manage requests" text="Accept or decline incoming swap requests." />
      </div>
    </FadeIn>
  );
}

function QuickAction({ to, icon, title, text }) {
  return (
    <Link to={to}>
      <Card hover className="stack" style={{ cursor: "pointer", height: "100%" }}>
        <div className="empty-icon" style={{ width: 46, height: 46, fontSize: "1.1rem", marginBottom: 4 }}>{icon}</div>
        <div className="row-between">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <FiArrowRight style={{ color: "var(--cyan)" }} />
        </div>
        <p style={{ margin: 0 }}>{text}</p>
      </Card>
    </Link>
  );
}
