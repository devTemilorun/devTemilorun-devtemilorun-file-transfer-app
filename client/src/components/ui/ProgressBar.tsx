import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  height = 'md',
  className = ''
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-800 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3 }}
          className="bg-blue-600 h-full rounded-full"
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs text-gray-400">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};