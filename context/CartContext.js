'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define initial item structure
const formatCartItem = (product, quantity, variation_id = null, variation = {}) => ({
  product_id: product.id.toString(),
  name: product.name,
  quantity,
  price: parseFloat(product.price) || 0.0, // Using sale_price
  image: product.images[0]?.src || '',
  categories: product.categories.length ? product.categories.map(cat=>cat.name || "") : [] || [],
  variation_id: variation_id ? variation_id.toString() : null,
  variation: variation,
});

// Create context
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
    setCartItemCount(storedCart.length || 0);
    setCartTotal(storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    setCartCount(storedCart.reduce((count, item) => count + item.quantity, 0));
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartItemCount(cartItems.length || 0);
    setCartTotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    setCartCount(cartItems.reduce((count, item) => count + item.quantity, 0));
  }, [cartItems]);

  // Add new item or update quantity if it already exists
  const addNewCartItem = (product, quantity = 1, variation_id = null, variation = {}) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product.id.toString() && item.variation_id === variation_id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.id.toString() && item.variation_id === variation_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, formatCartItem(product, quantity, variation_id, variation)];
    });
  };

  // Update the quantity of a specific item
  const updateCartItem = (product_id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      )
    );
  };

  // Remove a specific item from the cart
  const deleteCartItem = (product_id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== product_id)
    );
  };

  // Clear all items from the cart
  const deleteAllCartItems = () => {
    setCartItems([]);
  };


  // Retrieve all items in the cart along with the total price
  const viewAllCartItems = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      total,
      items: cartItems,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        cartTotal,
        cartCount,
        addNewCartItem,
        updateCartItem,
        deleteCartItem,
        deleteAllCartItems,
        viewAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
