// =========================================================================
//  Auth API — login, register, and the new email OTP verification
// =========================================================================
import client from "./client";

/** Verify email + password. Returns the user object on success, throws on failure. */
export async function login(email, password) {
  const { data } = await client.post("/login", { email, password });
  return data;
}

/** Create a new account. */
export async function register(name, email, password) {
  const { data } = await client.post("/register", { name, email, password });
  return data;
}

/**
 * Ask the backend to email a one-time code to the address.
 * In dev mode the response also contains { devCode } so we can show / auto-fill it.
 */
export async function sendOtp(email) {
  const { data } = await client.post("/auth/send-otp", { email });
  return data; // { message, devCode? }
}

/** Verify the 6-digit code. Throws (400) if invalid/expired. */
export async function verifyOtp(email, code) {
  const { data } = await client.post("/auth/verify-otp", { email, code });
  return data; // { verified: true }
}
