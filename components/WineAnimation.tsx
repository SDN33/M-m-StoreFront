import React from 'react';

interface WineAnimationProps {
  backgroundColor: string;
  animationSpeed: string;
}

const WineAnimation: React.FC<WineAnimationProps> = ({ backgroundColor, animationSpeed }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <defs>
        <circle id="bubble" r="4" fill="white">
          <animate attributeName="cy" from="100" to="0" dur={animationSpeed} repeatCount="indefinite" />
        </circle>
      </defs>
      <rect width="100%" height="100%" fill={backgroundColor} />
      <use href="#bubble" x="20" fill="rgba(255, 0, 0, 0.7)">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="0,-100" dur={animationSpeed} repeatCount="indefinite" />
      </use>
      <use href="#bubble" x="40" fill="rgba(0, 255, 0, 0.7)">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="0,-100" dur={animationSpeed} repeatCount="indefinite" />
      </use>
      <use href="#bubble" x="60" fill="rgba(0, 0, 255, 0.7)">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="0,-100" dur={animationSpeed} repeatCount="indefinite" />
      </use>
    </svg>
  );
};

export default WineAnimation;
