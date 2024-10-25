import { useState } from 'react';
import { Wine, Glasses, Grape, BadgeEuro } from 'lucide-react';
import { LucideProps } from 'lucide-react';

type ColorStyle = 'purple' | 'red' | 'yellow' | 'green';

interface CategoryBubbleProps {
  icon: React.ComponentType<LucideProps>;
  label: string;
  active?: boolean;
  color?: ColorStyle;
}



const colorStyles: Record<ColorStyle, { active: string; inactive: string }> = {
  purple: {
    active: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
    inactive: 'bg-gray-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white',
  },
  red: {
    active: 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
    inactive: 'bg-gray-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:text-white',
  },
  yellow: {
    active: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white',
    inactive: 'bg-gray-50 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-white',
  },
  green: {
    active: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
    inactive: 'bg-gray-50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-500 hover:text-white',
  },
};

const CategoryBubble = ({ icon: Icon, label, active = false, color = 'purple' }: CategoryBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer
        transition-all duration-300 transform hover:scale-105 active:scale-95
        ${active ? colorStyles[color].active : colorStyles[color].inactive}
        shadow-lg hover:shadow-xl
        border border-gray-100`}
    >
      <div className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}>
        <Icon size={20} className="w-5 h-5" />
      </div>
      <span className="text-sm font-bold tracking-wide">{label}</span>
      {active && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
    </div>
  );
};

const Suggestion = () => {
  return (
    <div className="relative max-w-6xl text-center mx-auto py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-wrap justify-center gap-4 ">
        <CategoryBubble icon={Wine} label="ROUGE" color="red" />
        <CategoryBubble icon={Wine} label="BLANC" color="yellow" />
        <CategoryBubble icon={Wine} label="ROSÉ" color="purple" />
        <CategoryBubble icon={Glasses} label="PROMO" active={true} color="green" />
        <CategoryBubble icon={Grape} label="PRESTIGE" active={true} color="purple" />
        <CategoryBubble icon={BadgeEuro} label="PETIT BUDGET" active={true} color="red" />
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-5">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-300 to-green-300 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Suggestion;
