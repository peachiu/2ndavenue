"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: number;
    listing_id: number;
    title: string;
    price: number;
    currency: string;
    image_url: string;
    quantity: number;
    seller_name: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (listing_id: number) => void;
    updateQuantity: (listing_id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "secondavenue-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setItems(parsed);
                }
            }
        } catch {}
        setHydrated(true);
    }, []);

    // Persist to localStorage whenever items change
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.listing_id === item.listing_id);
            if (existing) {
                return prev.map((i) =>
                    i.listing_id === item.listing_id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((listing_id: number) => {
        setItems((prev) => prev.filter((i) => i.listing_id !== listing_id));
    }, []);

    const updateQuantity = useCallback((listing_id: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.listing_id !== listing_id));
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.listing_id === listing_id ? { ...i, quantity } : i
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
