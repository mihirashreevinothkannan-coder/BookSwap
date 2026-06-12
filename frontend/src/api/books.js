// =========================================================================
//  Books API — wraps every /api/books endpoint exposed by the backend
// =========================================================================
import client from "./client";

/** Every book in the system (Browse page). */
export async function getAllBooks() {
  const { data } = await client.get("/books/all");
  return data;
}

/** Books owned by a user (My Books page). */
export async function getMyBooks(userId) {
  const { data } = await client.get(`/books/my/${userId}`);
  return data;
}

/** Books this user has currently borrowed. */
export async function getBorrowedBooks(userId) {
  const { data } = await client.get(`/books/borrowed/${userId}`);
  return data;
}

/** Add a new book owned by userId. */
export async function addBook(userId, book) {
  const { data } = await client.post(`/books/add/${userId}`, book);
  return data;
}

/** Mark a borrowed book as returned (sets it back to AVAILABLE). */
export async function returnBook(bookId) {
  const { data } = await client.put(`/books/return/${bookId}`);
  return data;
}
