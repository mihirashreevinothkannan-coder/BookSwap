import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiBookOpen } from "react-icons/fi";

import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { BookCardSkeleton } from "../components/ui/Skeleton";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getAllBooks } from "../api/books";
import { getSentRequests, sendRequest } from "../api/requests";
import { isWishlisted, toggleWishlist } from "../lib/localStore";
import { notify } from "../lib/toast";

// =========================================================================
//  Browse Books — search the whole library, request or wishlist a book
// =========================================================================
export default function BrowseBooks() {
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [wishTick, setWishTick] = useState(0); // forces re-render on wishlist change
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [all, sent] = await Promise.all([
        getAllBooks(),
        getSentRequests(userId).catch(() => []),
      ]);
      setBooks(all);
      setRequestedIds(
        sent
          .filter((r) => r.status === "PENDING" || r.status === "ACCEPTED")
          .map((r) => r.book?.id)
      );
    } catch {
      notify.error("Couldn't load books. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleRequest = async (bookId) => {
    try {
      await sendRequest(bookId, userId);
      notify.success("Request sent!");
      load();
    } catch (err) {
      notify.error(err?.response?.status === 400 ? "Request already exists" : "Could not send request");
    }
  };

  const handleWishlist = (book) => {
    const added = toggleWishlist(userId, book);
    setWishTick((t) => t + 1);
    notify.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  // Client-side search across title / author / genre.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      [b.title, b.author, b.genre].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [books, query]);

  return (
    <FadeIn>
      <div className="page-header row-between wrap">
        <div>
          <h1 style={{ marginBottom: 8 }}>Browse books</h1>
          <p style={{ margin: 0 }}>Discover books shared by the community.</p>
        </div>
        <div style={{ position: "relative", minWidth: 260 }}>
          <FiSearch style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Search title, author, genre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid-cards">
          {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiBookOpen />}
          title={query ? "No matches" : "No books yet"}
          message={query ? "Try a different search term." : "Be the first to share a book with the community."}
        />
      ) : (
        <div className="grid-cards">
          {filtered.map((book) => {
            const mine = book.owner?.id === Number(userId);
            const requested = requestedIds.includes(book.id);
            return (
              <BookCard
                key={book.id}
                book={book}
                to={`/books/${book.id}`}
                onWishlist={handleWishlist}
                wishlisted={isWishlisted(userId, book.id) && wishTick >= 0}
                actions={
                  mine ? (
                    <span className="chip" style={{ width: "100%", justifyContent: "center" }}>Your book</span>
                  ) : requested ? (
                    <Button variant="outline" block disabled>Requested</Button>
                  ) : (
                    <Button variant="primary" block onClick={() => handleRequest(book.id)}>
                      Request book
                    </Button>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </FadeIn>
  );
}
