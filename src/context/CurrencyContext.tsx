"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'EUR' | 'USD' | 'GBP' | 'JPY';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (amount: number, fromCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static exchange rates (base: EUR)
const EXCHANGE_RATES: Record<Currency, number> = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.85,
    JPY: 162.50
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    JPY: '¥'
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('EUR');

    useEffect(() => {
        const saved = localStorage.getItem('user-currency') as Currency;
        if (saved && EXCHANGE_RATES[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('user-currency', newCurrency);
    };

    const formatPrice = (amount: number, fromCurrency: string = 'EUR') => {
        // Convert to EUR first if not already (assuming input is from base or specific)
        // For this app, we'll assume the 'amount' passed is always in the original currency of the product
        // which in our seed data is always EUR for now.

        // Simple conversion: (Amount / RateFrom) * RateTo
        // Since our seed is base EUR, we just do Amount * EXCHANGE_RATES[currency]
        const converted = amount * EXCHANGE_RATES[currency];

        const symbol = CURRENCY_SYMBOLS[currency];

        if (currency === 'JPY') {
            return `${symbol}${Math.round(converted).toLocaleString()}`;
        }

        return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
