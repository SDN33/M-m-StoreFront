import axios from 'axios';

// Base Axios instance for API calls to your Next.js endpoints
const api = axios.create({
  baseURL: '/api/cart',
  headers: {
    'Content-Type': 'application/json',
  },
});

// View Cart
export const viewCart = async () => {
  try {
    const response = await api.get('/');
    return response.data; // Returns { total, items }
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw new Error('Failed to fetch cart');
  }
};

// Add to Cart (with optional variation support)
export const addToCart = async (product_id: number, quantity = 1, variation_id = 0, variation = {}) => {
  try {
    const response = await api.post('/', {
      action: 'add',
      product_id,
      quantity,
      variation_id,
      variation,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw new Error('Failed to add item to cart');
  }
};

// Update Cart Item
export const updateCartItem = async (product_id: number, quantity: number) => {
  try {
    const response = await api.post('/', {
      action: 'update',
      product_id,
      quantity,
    });
    return response.data;
  } catch (error) {
    // console.error('Failed to update cart item:', error);
    throw new Error('Failed to update cart item');
  }
};

// Remove Item from Cart
export const removeCartItem = async (product_id: number) => {
  try {
    const response = await api.post('/', {
      action: 'remove',
      product_id,
    });
    return response.data;
  } catch (error) {
    // console.error('Failed to remove item from cart:', error);
    throw new Error('Failed to remove item from cart');
  }
};

// Empty Cart
export const emptyCart = async () => {
  try {
    const response = await api.delete('/');
    return response.data;
  } catch (error) {
    // console.error('Failed to empty cart:', error);
    throw new Error('Failed to empty cart');
  }
};


// Use in Client
// import { viewCart, addToCart, updateCartItem, removeCartItem, emptyCart } from '../services/cart';

// const handleAddToCart = async () => {
//   try {
//     const response = await addToCart(productId, 1, variationId, { color: 'blue' });
//     console.log('Product added to cart:', response);
//   } catch (error) {
//     console.error(error);
//   }
// };
