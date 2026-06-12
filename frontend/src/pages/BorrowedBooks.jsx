import { useEffect, useState } from "react";
import { FiRepeat } from "react-icons/fi";

import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { BookCardSkeleton } from "../components/ui/Skeleton";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getBorrowedBooks, returnBook } from "../api/books";
import { notify } from "../lib/toast";

// =========================================================================
//  Borrowed Books — books currently borrowed, with a Return action
// =========================================================================
export default function BorrowedBooks() {
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getBorrowedBooks(userId);
      setBooks(data);
    } catch {
      notify.error("Couldn't load borrowed books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleReturn = async (bookId) => {
    try {
      await returnBook(bookId);
      notify.success("Book returned");
      load();
    } catch {
      notify.error("Could not return the book");
    }
  };

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>Borrowed books</h1>
        <p>Books you've borrowed. Return them when you're done.</p>
      </div>

      {loading ? (
        <div className="grid-cards">{Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)}</div>
      ) : books.length === 0 ? (
        <EmptyState
          icon={<FiRepeat />}
          title="Nothing borrowed"
          message="Books you borrow will appear here once a request is accepted."
        />
      ) : (
        <div className="grid-cards">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              actions={<Button variant="outline" block onClick={() => handleReturn(book.id)}>Return book</Button>}
            />
          ))}
        </div>
      )}
    </FadeIn>
  );
}
