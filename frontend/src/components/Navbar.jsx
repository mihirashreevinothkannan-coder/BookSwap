import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/add-book">Add Book</Link> |{" "}
            <Link to="/browse-books">Browse</Link> |{" "}
            <Link to="/my-books">My Books</Link> |{" "}
            <Link to="/my-requests">Requests</Link> |{" "}
            <Link to="/borrowed-books">Borrowed</Link>
        </nav>
    );
}