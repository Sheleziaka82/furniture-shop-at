import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ComparisonProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  material: string;
  color: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface ComparisonContextType {
  products: ComparisonProduct[];
  addProduct: (product: ComparisonProduct) => void;
  removeProduct: (productId: number) => void;
  clearComparison: () => void;
  isComparing: (productId: number) => boolean;
  maxProducts: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ComparisonProduct[]>([]);
  const maxProducts = 4;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparison-products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load comparison products:', error);
      }
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('comparison-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: ComparisonProduct) => {
    if (products.length >= maxProducts) {
      return;
    }
    if (!products.find((p) => p.id === product.id)) {
      setProducts([...products, product]);
    }
  };

  const removeProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setProducts([]);
  };

  const isComparing = (productId: number) => {
    return products.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        clearComparison,
        isComparing,
        maxProducts,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
