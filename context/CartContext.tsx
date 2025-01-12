import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartContextType = {
  countItemsInCart: number;
  setCountItemsInCart: (count: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [countItemsInCart, setCountItemsInCart] = useState<number>(0);

  return (
    <CartContext.Provider value={{ countItemsInCart, setCountItemsInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
