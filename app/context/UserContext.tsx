"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

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

export function UserProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(5);
  const [loggedIn, setLoggedIn] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((prev) => [...prev, item]);
  };

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <UserContext.Provider
      value={{ credits, loggedIn, history, addHistory, login }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside <UserProvider>");
  }
  return ctx;
}
