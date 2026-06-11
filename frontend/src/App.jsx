import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import BrowseBooks from "./pages/BrowseBooks";
import MyBooks from "./pages/MyBooks";
import MyRequests from "./pages/MyRequests";
import BorrowedBooks from "./pages/BorrowedBooks";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/browse-books" element={<BrowseBooks />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/borrowed-books" element={<BorrowedBooks />} />
        </Routes>
    );
}

export default App;