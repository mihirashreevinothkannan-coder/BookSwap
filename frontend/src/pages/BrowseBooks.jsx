import { useEffect, useState } from "react";
import api from "../api";

export default function BrowseBooks() {
    const [books, setBooks] = useState([]);
    const [requestedBookIds, setRequestedBookIds] = useState([]);

    const userId = localStorage.getItem("userId");

    const loadBooks = async () => {
        try {
            const response = await api.get("/books/all");
            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadSentRequests = async () => {
        try {
            const response = await api.get(
                `/requests/sent/${userId}`
            );

            const ids = response.data
                .filter(
                    (request) =>
                        request.status === "PENDING" ||
                        request.status === "ACCEPTED"
                )
                .map((request) => request.book.id);

            setRequestedBookIds(ids);
        } catch (error) {
            console.error(error);
        }
    };

    const sendRequest = async (bookId) => {
        try {
            await api.post(
                `/requests/send?bookId=${bookId}&senderId=${userId}`
            );

            alert("Request Sent");

            loadSentRequests();
        } catch (error) {
            console.error(error);

            if (error.response?.status === 400) {
                alert("Request already exists");
            } else {
                alert("Failed To Send Request");
            }
        }
    };

    useEffect(() => {
        loadBooks();
        loadSentRequests();
    }, []);

    return (
        <div>
            <h1>Browse Books</h1>

            {books.length === 0 ? (
                <p>No Books Available</p>
            ) : (
                books.map((book) => (
                    <div key={book.id}>
                        <h3>{book.title}</h3>

                        <p>Author: {book.author}</p>

                        <p>Edition: {book.edition}</p>

                        <p>Genre: {book.genre}</p>

                        <p>Condition: {book.conditionType}</p>

                        <p>Availability: {book.availability}</p>

                        <p>Owner: {book.owner?.name}</p>

                        {book.owner?.id !== Number(userId) && (
                            requestedBookIds.includes(book.id) ? (
                                <button disabled>
                                    Requested
                                </button>
                            ) : (
                                <button
                                    onClick={() => sendRequest(book.id)}
                                >
                                    Request Book
                                </button>
                            )
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}