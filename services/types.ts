// services/order/types.ts

export interface Order {
    id: number;
    status: string;
    payment_method: string;
    payment_method_title: string;
    total: string;
    billing: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
      email: string;
      phone: string;
    };
    shipping: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    line_items: {
      product_id: number;
      quantity: number;
      name: string;
      price: string;
    }[];
    shipping_lines: {
      method_id: string;
      method_title: string;
      total: string;
    }[];
    date_created: string;
  }
  