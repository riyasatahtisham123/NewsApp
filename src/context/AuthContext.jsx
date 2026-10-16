import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const USERS_KEY = 'dl_users';
const SESSION_KEY = 'dl_session';

const AuthContext = createContext(null);

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const value = useMemo(() => ({
    user,

    signup({ name, email, password }) {
      const users = readUsers();
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email === normalized)) {
        return { ok: false, message: 'An account with this email already exists. Try signing in.' };
      }
      const newUser = { name: name.trim(), email: normalized, password, createdAt: new Date().toISOString() };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      setUser({ name: newUser.name, email: newUser.email });
      return { ok: true, message: `Welcome aboard, ${newUser.name}!` };
    },

    login({ email, password }) {
      const normalized = email.trim().toLowerCase();
      const found = readUsers().find((u) => u.email === normalized);
      if (!found || found.password !== password) {
        return { ok: false, message: 'Incorrect email or password.' };
      }
      setUser({ name: found.name, email: found.email });
      return { ok: true, message: `Welcome back, ${found.name}!` };
    },

    logout() {
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
