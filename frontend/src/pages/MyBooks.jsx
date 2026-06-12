import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBook, FiPlusCircle } from "react-icons/fi";

import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { BookCardSkeleton } from "../components/ui/Skeleton";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getMyBooks } from "../api/books";
import { notify } from "../lib/toast";

// =========================================================================
//  My Books — books the current user owns
// =========================================================================
export default function MyBooks() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getMyBooks(userId);
        if (active) setBooks(data);
      } catch {
        notify.error("Couldn't load your books");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [userId]);

  return (
    <FadeIn>
      <div className="page-header row-between wrap">
        <div>
          <h1 style={{ marginBottom: 8 }}>My books</h1>
          <p style={{ margin: 0 }}>Everything you've shared with the community.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/add-book")}>
          <FiPlusCircle /> Add book
        </Button>
      </div>

      {loading ? (
        <div className="grid-cards">{Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)}</div>
      ) : books.length === 0 ? (
        <EmptyState
          icon={<FiBook />}
          title="No books yet"
          message="Add a book from your shelf and it'll show up here."
          action={<Button variant="primary" onClick={() => navigate("/add-book")}><FiPlusCircle /> Add your first book</Button>}
        />
      ) : (
        <div className="grid-cards">
          {books.map((book) => (
            <BookCard key={book.id} book={book} to={`/books/${book.id}`} />
          ))}
        </div>
      )}
    </FadeIn>
  );
}
