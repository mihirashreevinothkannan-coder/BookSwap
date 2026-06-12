import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiSearch,
  FiPlusCircle,
  FiBook,
  FiRepeat,
  FiInbox,
  FiHeart,
  FiBell,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { unreadCount } from "../../lib/localStore";
import { notify } from "../../lib/toast";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
  { to: "/browse-books", label: "Browse", icon: <FiSearch /> },
  { to: "/add-book", label: "Add Book", icon: <FiPlusCircle /> },
  { to: "/my-books", label: "My Books", icon: <FiBook /> },
  { to: "/borrowed-books", label: "Borrowed", icon: <FiRepeat /> },
  { to: "/my-requests", label: "Requests", icon: <FiInbox /> },
  { to: "/wishlist", label: "Wishlist", icon: <FiHeart /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, userId, logout } = useAuth();
  const navigate = useNavigate();
  const unread = userId ? unreadCount(userId) : 0;

  const handleLogout = () => {
    logout();
    notify.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/dashboard" className="brand">
          <span className="brand-mark">📚</span>
          Book<span className="text-gradient">Swap</span>
        </NavLink>

        <div className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.icon}
              {l.label}
            </NavLink>
          ))}

          <NavLink to="/notifications" className="nav-link">
            <FiBell />
            Alerts
            {unread > 0 && <span className="nav-badge">{unread}</span>}
          </NavLink>

          <NavLink to="/profile" className="nav-link">
            {/* Avatar initial */}
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--grad)",
                color: "#06070d",
                display: "grid",
                placeItems: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {(user?.name || "?").charAt(0).toUpperCase()}
            </span>
            Profile
          </NavLink>

          <button className="nav-link" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FiLogOut />
            Logout
          </button>
        </div>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </nav>
  );
}
