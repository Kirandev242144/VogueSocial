"use client";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeCtx = createContext({ theme: 'light', toggle: () => { } });
export function MerchantThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        // Force light theme as primary default for clean white UI
        setTheme('light');
        localStorage.setItem('merchant-theme', 'light');
    }, []);
    const toggle = () => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('merchant-theme', next);
            return next;
        });
    };
    return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
export function useMerchantTheme() {
    return useContext(ThemeCtx);
}
