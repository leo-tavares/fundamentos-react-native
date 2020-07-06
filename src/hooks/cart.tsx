import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    setProducts(olsProducts => {
      const idx = olsProducts.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        return olsProducts.map((p, index) => {
          if (index === idx) {
            return {
              ...p,
              quantity: p.quantity + 1,
            };
          }
          return p;
        });
      }
      return [...olsProducts, { ...product, quantity: 1 }];
    });
  }, []);

  const increment = useCallback(async id => {
    setProducts(oldProducts =>
      oldProducts.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      ),
    );
  }, []);

  const decrement = useCallback(async id => {
    setProducts(oldProducts =>
      oldProducts.map(p => {
        if (p.id === id) {
          return p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p;
        }
        return p;
      }),
    );
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
