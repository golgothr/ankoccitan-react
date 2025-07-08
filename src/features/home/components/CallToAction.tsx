import React from 'react';
import { Link } from 'react-router-dom';

interface CallToActionProps {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CallToAction({
  text,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  className = '',
}: CallToActionProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-orange-600 hover:bg-red-50 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-orange-600',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
} 