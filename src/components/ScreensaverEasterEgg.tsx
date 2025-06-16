
import React, { useState, useEffect, useCallback } from 'react';

interface ScreensaverEasterEggProps {
  isActive: boolean;
  onDeactivate: () => void;
}

const ScreensaverEasterEgg: React.FC<ScreensaverEasterEggProps> = ({ isActive, onDeactivate }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 0.5, y: 0.3 });
  const [logoColor, setLogoColor] = useState('from-blue-500 to-amber-500');

  const colors = [
    'from-blue-500 to-amber-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-blue-500',
    'from-red-500 to-orange-500',
    'from-indigo-500 to-purple-500',
    'from-yellow-500 to-red-500'
  ];

  const changeColor = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setLogoColor(randomColor);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const animateLoop = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        // Rimbalzo sui bordi orizzontali
        if (newX <= 5 || newX >= 90) {
          newVelX = -newVelX;
          newX = newX <= 5 ? 5 : 90;
          changeColor();
        }

        // Rimbalzo sui bordi verticali
        if (newY <= 5 || newY >= 85) {
          newVelY = -newVelY;
          newY = newY <= 5 ? 5 : 85;
          changeColor();
        }

        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(animateLoop, 50); // Rallentato da 16ms a 50ms
    return () => clearInterval(interval);
  }, [isActive, velocity, changeColor]);

  const handleClick = () => {
    onDeactivate();
  };

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 cursor-pointer overflow-hidden"
      onClick={handleClick}
      onMouseMove={handleClick}
      onKeyDown={handleClick}
      tabIndex={0}
    >
      {/* Effetto TV statico */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
      </div>

      {/* Logo rimbalzante */}
      <div 
        className="absolute transition-transform duration-75 ease-linear"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${logoColor} flex items-center justify-center shadow-2xl shadow-white/20`}>
          <span className="text-3xl font-bold text-white">LB</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-white text-sm font-medium">Learning Bites</span>
        </div>
      </div>

      {/* Istruzioni per uscire */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-white/60 text-sm text-center">
          Muovi il mouse o clicca per tornare alla dashboard
        </p>
      </div>
    </div>
  );
};

export default ScreensaverEasterEgg;
