'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define initial item structure
const formatCartItem = (product, quantity, variation_id = null, variation = {}) => ({
  product_id: product.id.toString(),
  name: product.name,
  quantity,
  price: parseFloat(product.price) || 0.0, // Using sale_price
  image: product.images[0]?.src || '',
  categories: product.categories.length ? product.categories.map((cat) => cat.name || '') : [],
  store_name: product.store_name || "Pas de nom de vendeur", // Correction ici
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

  // Nouvelle fonction pour synchroniser le panier
  const synchronizeCart = (storedCart) => {
    // Ajout d'un timestamp pour gérer l'expiration
    const cartWithTimestamp = storedCart.map(item => ({
      ...item,
      addedAt: item.addedAt || Date.now()
    }));

    // Filtrer les éléments de moins de 30 jours
    const currentCart = cartWithTimestamp.filter(
      item => Date.now() - item.addedAt < 30 * 24 * 60 * 60 * 1000
    );

    return currentCart;
  };

  // Load cart items from localStorage on mount with synchronization
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const synchronizedCart = synchronizeCart(storedCart);

    setCartItems(synchronizedCart);
    setCartItemCount(synchronizedCart.length || 0);
    setCartTotal(synchronizedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    setCartCount(synchronizedCart.reduce((count, item) => count + item.quantity, 0));

    // Mettre à jour le localStorage avec le panier synchronisé
    localStorage.setItem('cartItems', JSON.stringify(synchronizedCart));
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

      const newItem = formatCartItem(product, quantity, variation_id, variation);
      return [...prevItems, { ...newItem, addedAt: Date.now() }];
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
