import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('scan_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addHistory = (result) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...result
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem('scan_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scan_history');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, history, addHistory, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
