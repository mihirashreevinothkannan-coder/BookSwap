import { useState } from "react";
import api from "../api";

export default function AddBook() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [edition, setEdition] = useState("");
    const [genre, setGenre] = useState("");
    const [conditionType, setConditionType] = useState("");

    const handleAddBook = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const bookData = {
                title,
                author,
                edition,
                genre,
                conditionType,
            };

            const response = await api.post(
                `/books/add/${userId}`,
                bookData
            );

            console.log(response.data);

            alert("Book Added Successfully");

            setTitle("");
            setAuthor("");
            setEdition("");
            setGenre("");
            setConditionType("");
        } catch (error) {
            console.error(error);
            alert("Failed To Add Book");
        }
    };

    return (
        <div>
            <h1>Add Book</h1>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Edition"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Condition"
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
            />

            <br /><br />

            <button onClick={handleAddBook}>
                Add Book
            </button>
        </div>
    );
}