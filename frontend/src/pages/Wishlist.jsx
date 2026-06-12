import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiSearch } from "react-icons/fi";

import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getWishlist, toggleWishlist } from "../lib/localStore";
import { notify } from "../lib/toast";

// =========================================================================
//  Wishlist — saved books (stored client-side per user in localStorage)
// =========================================================================
export default function Wishlist() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState(() => getWishlist(userId));

  const remove = (book) => {
    toggleWishlist(userId, book);
    setBooks(getWishlist(userId));
    notify.success("Removed from wishlist");
  };

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>Wishlist</h1>
        <p>Books you've saved for later.</p>
      </div>

      {books.length === 0 ? (
        <EmptyState
          icon={<FiHeart />}
          title="Your wishlist is empty"
          message="Tap the heart on any book to save it here."
          action={<Button variant="primary" onClick={() => navigate("/browse-books")}><FiSearch /> Browse books</Button>}
        />
      ) : (
        <div className="grid-cards">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              to={`/books/${book.id}`}
              onWishlist={remove}
              wishlisted
            />
          ))}
        </div>
      )}
    </FadeIn>
  );
}
