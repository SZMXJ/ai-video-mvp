"use client";

import { createContext, useContext, useState } from "react";

type User = {
  loggedIn: boolean;
  plan: "free" | "pro";
  credits: number;
};

const UserContext = createContext<{
  user: User;
  login: () => void;
  logout: () => void;
  upgrade: () => void;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    loggedIn: false,
    plan: "free",
    credits: 10,
  });

  const login = () => {
    setUser({
      loggedIn: true,
      plan: "free",
      credits: 10,
    });
  };

  const logout = () => {
    setUser({
      loggedIn: false,
      plan: "free",
      credits: 0,
    });
  };

  const upgrade = () => {
    setUser((u) => ({
      ...u,
      plan: "pro",
      credits: 999,
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, upgrade }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
