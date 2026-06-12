// =========================================================================
//  AuthContext
//  -----------------------------------------------------------------------
//  Holds the logged-in user and persists it to localStorage so a refresh
//  keeps you signed in. Login is only completed AFTER OTP verification
//  (see the Login page), at which point `login()` is called here.
// =========================================================================
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "bookswap.user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // Keep legacy keys in sync (older code read userId / userName directly).
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    }
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const value = {
    user,
    userId: user?.id ?? null,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
