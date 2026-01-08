"use client";

import { createContext, useState, ReactNode } from "react";

export type HistoryItem = {
  time: string;
  prompt: string;
  style: string;
};

type UserState = {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
};

export const UserContext = createContext<UserState>({
  history: [],
  addHistory: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  return (
    <UserContext.Provider value={{ history, addHistory }}>
      {children}
    </UserContext.Provider>
  );
}
