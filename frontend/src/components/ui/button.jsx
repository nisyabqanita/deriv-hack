import React from 'react';
import { cn } from '@/lib/util';

export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  type = "button",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-200 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8",
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
