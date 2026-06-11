import { useEffect, useState } from "react";
import api from "../api";

export default function MyBooks() {
    const [books, setBooks] = useState([]);

    const loadBooks = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const response = await api.get(
                `/books/my/${userId}`
            );

            console.log(response.data);

            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    return (
        <div>
            <h1>My Books</h1>

            {books.length === 0 ? (
                <p>No Books Found</p>
            ) : (
                books.map((book) => (
                    <div key={book.id}>
                        <h3>{book.title}</h3>

                        <p>Author: {book.author}</p>

                        <p>Edition: {book.edition}</p>

                        <p>Genre: {book.genre}</p>

                        <p>Condition: {book.conditionType}</p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}