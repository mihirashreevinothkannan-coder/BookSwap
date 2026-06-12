import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiUser, FiBookOpen } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getAllBooks } from "../api/books";
import { getSentRequests, sendRequest } from "../api/requests";
import { isWishlisted, toggleWishlist } from "../lib/localStore";
import { notify } from "../lib/toast";

// =========================================================================
//  Book Details — full view of a single book
//  (Backend has no GET /books/{id}, so we resolve it from /books/all.)
// =========================================================================
export default function BookDetails() {
  const { id } = useParams();
  const bookId = Number(id);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [all, sent] = await Promise.all([
          getAllBooks(),
          getSentRequests(userId).catch(() => []),
        ]);
        if (!active) return;
        const found = all.find((b) => b.id === bookId) || null;
        setBook(found);
        setRequested(
          sent.some((r) => r.book?.id === bookId && (r.status === "PENDING" || r.status === "ACCEPTED"))
        );
        setWished(isWishlisted(userId, bookId));
      } catch {
        notify.error("Couldn't load this book");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [bookId, userId]);

  const handleRequest = async () => {
    try {
      await sendRequest(bookId, userId);
      setRequested(true);
      notify.success("Request sent!");
    } catch (err) {
      notify.error(err?.response?.status === 400 ? "Request already exists" : "Could not send request");
    }
  };

  const handleWishlist = () => {
    const added = toggleWishlist(userId, book);
    setWished(added);
    notify.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  if (loading) return <Spinner full />;

  if (!book) {
    return (
      <FadeIn>
        <EmptyState
          icon={<FiBookOpen />}
          title="Book not found"
          message="This book may have been removed."
          action={<Button variant="outline" onClick={() => navigate("/browse-books")}>Back to browse</Button>}
        />
      </FadeIn>
    );
  }

  const mine = book.owner?.id === Number(userId);

  return (
    <FadeIn>
      <Link to="/browse-books" className="row text-dim" style={{ marginBottom: 20, width: "fit-content" }}>
        <FiArrowLeft /> Back to browse
      </Link>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)", alignItems: "start" }}>
        {/* Cover placeholder */}
        <Card style={{ display: "grid", placeItems: "center", aspectRatio: "3 / 4", background: "var(--grad-soft)" }}>
          <FiBookOpen size={64} style={{ color: "var(--cyan)", opacity: 0.7 }} />
        </Card>

        {/* Info */}
        <div>
          <div className="row wrap" style={{ marginBottom: 12 }}>
            <Badge status={book.availability} />
          </div>
          <h1 style={{ marginBottom: 8 }}>{book.title}</h1>
          <p style={{ fontSize: "1.1rem" }}>by {book.author || "Unknown author"}</p>

          <div className="row wrap" style={{ gap: 8, margin: "16px 0" }}>
            {book.genre && <span className="chip">{book.genre}</span>}
            {book.edition && <span className="chip">Edition {book.edition}</span>}
            {book.conditionType && <span className="chip">{book.conditionType} condition</span>}
          </div>

          <Card className="stack" style={{ marginBottom: 20 }}>
            <div className="row" style={{ gap: 10 }}>
              <span
                style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--grad)", color: "#06070d",
                  display: "grid", placeItems: "center", fontWeight: 700 }}
              >
                {(book.owner?.name || "?").charAt(0).toUpperCase()}
              </span>
              <div>
                <div style={{ fontWeight: 600, color: "#fff" }}>{book.owner?.name || "Unknown owner"}</div>
                <div className="text-muted row" style={{ fontSize: "0.82rem", gap: 5 }}>
                  <FiUser size={12} /> Owner
                </div>
              </div>
            </div>
          </Card>

          <div className="row wrap">
            {!mine && (
              requested ? (
                <Button variant="outline" disabled>Already requested</Button>
              ) : (
                <Button variant="primary" onClick={handleRequest}>Request this book</Button>
              )
            )}
            <Button variant={wished ? "danger" : "outline"} onClick={handleWishlist}>
              <FiHeart fill={wished ? "currentColor" : "none"} /> {wished ? "Wishlisted" : "Add to wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
