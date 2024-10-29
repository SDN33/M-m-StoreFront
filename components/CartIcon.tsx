import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartIcon = ({onClick}: any) => {
  const { cartCount } = useCart();
  console.log('##cartCount :>> ', cartCount);

  return (
    <>
    {/* <Link href="/cart" passHref> */}
      <span  className="relative">
        <ShoppingCart onClick={onClick} className="w-6 h-6 hover:text-primary font-semibold cursor-pointer" />
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {cartCount > 0  ? cartCount : 0}
        </span>
      </span>
    {/* </Link> */}
    </>
  );
};

export default CartIcon;
