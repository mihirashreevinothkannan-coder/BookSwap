// =========================================================================
//  Swap Requests API — wraps every /api/requests endpoint
// =========================================================================
import client from "./client";

/** Send a borrow/swap request for a book. */
export async function sendRequest(bookId, senderId) {
  const { data } = await client.post(
    `/requests/send?bookId=${bookId}&senderId=${senderId}`
  );
  return data;
}

/** Requests this user has sent to others. */
export async function getSentRequests(userId) {
  const { data } = await client.get(`/requests/sent/${userId}`);
  return data;
}

/** Requests other users have sent to this user. */
export async function getReceivedRequests(userId) {
  const { data } = await client.get(`/requests/received/${userId}`);
  return data;
}

/** Owner accepts a pending request. */
export async function acceptRequest(requestId) {
  const { data } = await client.put(`/requests/accept/${requestId}`);
  return data;
}

/** Owner rejects a pending request. */
export async function rejectRequest(requestId) {
  const { data } = await client.put(`/requests/reject/${requestId}`);
  return data;
}
