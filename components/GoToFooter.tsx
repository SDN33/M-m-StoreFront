import { ChevronDown } from 'lucide-react';

const GoToFootButton = () => {
  const scrollToBottom = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <button
        onClick={scrollToBottom}
        className="bg-white w-full p-4 text-black border-primary border-3 font-bold overflow-hidden"
        aria-label="Défiler vers le bas"
      >
        <span className="flex items-center justify-center hover:scale-150">
          <ChevronDown size={42} />
        </span>
      </button>
    </div>
  );
};

export default GoToFootButton;
