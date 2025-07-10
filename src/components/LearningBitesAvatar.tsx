import React from 'react';
import { motion } from 'framer-motion';

interface LearningBitesAvatarProps {
  message: string;
  isVisible: boolean;
  className?: string;
}

export const LearningBitesAvatar: React.FC<LearningBitesAvatarProps> = ({
  message,
  isVisible,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      className={`flex items-start gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10 ${className}`}
      style={{ 
        display: isVisible ? 'flex' : 'none' 
      }}
    >
      {/* Avatar Logo */}
      <motion.div
        animate={{ 
          scale: isVisible ? [1, 1.05, 1] : 1,
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
      >
        <span className="text-white font-bold text-lg">LB</span>
      </motion.div>

      {/* Message Content */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-primary/5"
        >
          <p className="text-foreground leading-relaxed">{message}</p>
        </motion.div>
        
        {/* Speech bubble tail */}
        <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/80 ml-4 -mt-1"></div>
      </div>
    </motion.div>
  );
};