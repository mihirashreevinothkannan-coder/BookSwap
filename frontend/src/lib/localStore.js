// =========================================================================
//  Client-side stores (Wishlist & Notifications)
//  -----------------------------------------------------------------------
//  The backend has no endpoints for a wishlist or notifications, so these
//  two features are implemented purely on the client using localStorage,
//  scoped per user id. This keeps the app fully functional and professional
//  without requiring backend changes.
// =========================================================================

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ----------------------------- Wishlist ------------------------------- */

const wishlistKey = (userId) => `bookswap.wishlist.${userId}`;

export function getWishlist(userId) {
  return read(wishlistKey(userId), []);
}

export function isWishlisted(userId, bookId) {
  return getWishlist(userId).some((b) => b.id === bookId);
}

/** Add or remove a book from the wishlist. Returns the new wishlisted state. */
export function toggleWishlist(userId, book) {
  const list = getWishlist(userId);
  const exists = list.some((b) => b.id === book.id);
  const next = exists
    ? list.filter((b) => b.id !== book.id)
    : [...list, book];
  write(wishlistKey(userId), next);
  return !exists;
}

export function removeFromWishlist(userId, bookId) {
  write(
    wishlistKey(userId),
    getWishlist(userId).filter((b) => b.id !== bookId)
  );
}

/* --------------------------- Notifications ---------------------------- */

const notifKey = (userId) => `bookswap.notifications.${userId}`;

export function getNotifications(userId) {
  return read(notifKey(userId), []);
}

export function addNotification(userId, { title, body, type = "info" }) {
  const list = getNotifications(userId);
  const item = {
    id: Date.now() + Math.random(),
    title,
    body,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  write(notifKey(userId), [item, ...list]);
  return item;
}

export function markAllRead(userId) {
  write(
    notifKey(userId),
    getNotifications(userId).map((n) => ({ ...n, read: true }))
  );
}

export function clearNotifications(userId) {
  write(notifKey(userId), []);
}

export function unreadCount(userId) {
  return getNotifications(userId).filter((n) => !n.read).length;
}
