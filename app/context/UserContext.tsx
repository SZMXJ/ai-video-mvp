"use client";

import { createContext, useState, ReactNode } from "react";

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

export const UserContext = createContext<UserState>({
  credits: 5,
  loggedIn: false,
  history: [],
  addHistory: () => {},
  login: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(5);
  const [loggedIn, setLoggedIn] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
    setCredits((c) => Math.max(0, c - 1));
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
