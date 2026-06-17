import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  style,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getVariantStyles = (): React.CSSProperties => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-light)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none'
        };
      default:
        return {};
    }
  };
  
  const getSizeStyles = (): React.CSSProperties => {
    switch(size) {
      case 'sm': return { padding: '6px 12px', fontSize: '14px' };
      case 'md': return { padding: '8px 16px', fontSize: '16px' };
      case 'lg': return { padding: '12px 24px', fontSize: '18px' };
      default: return {};
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  const combinedStyles: React.CSSProperties = {
    ...variantStyles,
    ...sizeStyles,
    ...style
  };
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${className}`}
      style={combinedStyles}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : children}
    </motion.button>
  );
};