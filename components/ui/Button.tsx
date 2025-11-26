import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "w-full py-3 px-4 font-bold text-lg uppercase shadow-md transition-transform active:scale-95 border-2 border-black/20";
  const colors = variant === 'primary' 
    ? "bg-yellow-400 text-black hover:bg-yellow-300" 
    : "bg-red-500 text-white hover:bg-red-400";

  return (
    <button className={`${baseStyle} ${colors} ${className}`} {...props}>
      {children}
    </button>
  );
};
