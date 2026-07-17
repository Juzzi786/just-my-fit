import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      toast.success('Added to wishlist!', { icon: '❤️' });
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId) => items.some(i => i.id === productId);

  const toggleWishlist = (product) => {
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
