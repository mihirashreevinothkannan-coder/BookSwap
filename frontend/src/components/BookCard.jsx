import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiUser } from "react-icons/fi";
import Badge from "./ui/Badge";

/**
 * Reusable book card used on Browse, My Books, Wishlist, etc.
 *
 * Props:
 *   book        - the book object from the API
 *   actions     - optional ReactNode rendered at the bottom (buttons)
 *   onWishlist  - optional handler; shows a heart toggle when provided
 *   wishlisted  - whether the heart is filled
 *   to          - optional link target for the title (book details)
 */
export default function BookCard({ book, actions, onWishlist, wishlisted, to }) {
  const title = to ? <Link to={to}>{book.title}</Link> : book.title;

  return (
    <motion.div
      className="card card-hover stack"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className="row-between" style={{ alignItems: "flex-start" }}>
        <h3 style={{ margin: 0, lineHeight: 1.25 }}>{title}</h3>
        {onWishlist && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onWishlist(book)}
            aria-label="Toggle wishlist"
            style={{ color: wishlisted ? "var(--pink)" : "var(--text-muted)" }}
          >
            <FiHeart fill={wishlisted ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <p style={{ margin: 0, color: "var(--text-dim)" }}>by {book.author || "Unknown"}</p>

      <div className="row wrap" style={{ gap: 8 }}>
        {book.genre && <span className="chip">{book.genre}</span>}
        {book.edition && <span className="chip">Ed. {book.edition}</span>}
        {book.conditionType && <span className="chip">{book.conditionType}</span>}
      </div>

      <div className="row-between" style={{ marginTop: 4 }}>
        {book.availability && <Badge status={book.availability} />}
        {book.owner?.name && (
          <span className="row text-muted" style={{ fontSize: "0.82rem", gap: 5 }}>
            <FiUser size={13} /> {book.owner.name}
          </span>
        )}
      </div>

      {actions && <div style={{ marginTop: 4 }}>{actions}</div>}
    </motion.div>
  );
}
