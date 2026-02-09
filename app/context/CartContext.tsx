'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import api from '../../axios';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  incrementCount: (amount?: number) => void;
  decrementCount: (amount?: number) => void;
  setCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const response = await api.get('/Customer/Cartcount');
      if (response.data?.count !== undefined) {
        setCartCount(response.data.count);
      }
    } catch {
    }
  }, []);

  const incrementCount = useCallback((amount: number = 1) => {
    setCartCount(prev => prev + amount);
  }, []);

  const decrementCount = useCallback((amount: number = 1) => {
    setCartCount(prev => Math.max(0, prev - amount));
  }, []);

  const setCount = useCallback((count: number) => {
    setCartCount(count);
  }, []);

  useEffect(() => {
    (async () => {
      await refreshCartCount();
    })();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      refreshCartCount, 
      incrementCount, 
      decrementCount, 
      setCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
