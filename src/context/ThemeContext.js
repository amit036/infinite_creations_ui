"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState({
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#6366f1',
        font: 'Inter'
    });

    const applyTheme = (newTheme) => {
        setTheme(prev => ({ ...prev, ...newTheme }));
        const root = document.documentElement;
        root.style.setProperty('--primary', newTheme.primary);
        root.style.setProperty('--secondary', newTheme.secondary);
        root.style.setProperty('--accent', newTheme.accent);
        root.style.setProperty('--font-main', newTheme.font);
    };

    return (
        <ThemeContext.Provider value={{ theme, applyTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
