import { useEffect, useState } from "react";
import api from "../api";

export default function BorrowedBooks() {
    const [books, setBooks] = useState([]);

    const userId = localStorage.getItem("userId");

    const loadBooks = async () => {
        const res = await api.get(
            `/books/borrowed/${userId}`
        );
        setBooks(res.data);
    };

    const returnBook = async (bookId) => {
        await api.put(`/books/return/${bookId}`);
        alert("Book Returned");
        loadBooks();
    };

    useEffect(() => {
        loadBooks();
    }, []);

    return (
        <div>
            <h1>Borrowed Books</h1>

            {books.map((book) => (
                <div key={book.id}>
                    <h3>{book.title}</h3>
                    <p>Owner: {book.owner?.name}</p>
                    <button onClick={() => returnBook(book.id)}>
                        Return Book
                    </button>
                    <hr />
                </div>
            ))}
        </div>
    );
}