import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { cartCount } = useCart();
  console.log('##cartCount :>> ', cartCount);

  return (
    <span className="relative pr-4">
      <ShoppingCart onClick={onClick} className="w-7 h-7 hover:scale-105 font-semibold cursor-pointer" />
      <span className="absolute -top-1 right-3  bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {cartCount > 0 ? cartCount : 0}
      </span>
    </span>
  );
};

export default CartIcon;
