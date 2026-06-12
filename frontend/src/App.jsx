import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Authenticated pages
import Dashboard from "./pages/Dashboard";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import BorrowedBooks from "./pages/BorrowedBooks";
import SwapRequests from "./pages/SwapRequests";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// =========================================================================
//  Routing
//  -----------------------------------------------------------------------
//  - Public: "/", "/login", "/register"
//  - Everything else is wrapped in <ProtectedRoute> + <AppLayout> (navbar
//    + footer chrome). Old paths (/dashboard, /browse-books, ...) are kept
//    so nothing breaks.
// =========================================================================
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated — share the navbar/footer layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse-books" element={<BrowseBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
        <Route path="/my-requests" element={<SwapRequests />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
