"use client";

import React, { createContext, useContext, useState } from "react";

export type HistoryItem = {
  time: string;
  prompt: string;
  style: string;
};

type UserState = {
  credits: number;
  loggedIn: boolean;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  login: () => void;
};

const UserContext = createContext<UserState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(5);
  const [loggedIn, setLoggedIn] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
    setCredits((c) => Math.max(c - 1, 0));
  };

  const login = () => setLoggedIn(true);

  return (
    <UserContext.Provider
      value={{ credits, loggedIn, history, addHistory, login }}
    >
      {children}
    </UserContext.Provider>
  );
}

/** ✅ 唯一允许页面使用的 Hook */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside <UserProvider>");
  }
  return ctx;
}
