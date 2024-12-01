import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className }) => {
  const { cartCount } = useCart();

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onClick={onClick}
        className="group relative cursor-pointer"
      >
        <ShoppingCart
          className="w-8 h-8 text-white group-hover:text-black
          transition-all duration-300 ease-in-out
          transform group-hover:scale-110"
        />
        {cartCount > 0 && (
          <span
            className="absolute -top-2 -right-2
            bg-black text-white text-xs
            rounded-full w-5 h-5
            flex items-center justify-center
            animate-pulse"
          >
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
