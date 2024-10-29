// services/order.ts
import axios from 'axios';

import { Order } from './types';

export const getOrder = async (orderId: number): Promise<Order> => {
  try {
    const response = await axios.get<Order>(`/api/order?id=${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw new Error('Unable to retrieve order data');
  }
};

export const createOrder = async (orderData: Order) => {
  try {
    const response = await axios.post('/api/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Order creation failed');
  }
};
