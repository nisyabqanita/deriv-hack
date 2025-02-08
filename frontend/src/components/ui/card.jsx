import React from 'react';
import { cn } from '@/lib/util';

export const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white text-gray-950 shadow-sm",
        className
      )}
      {...props}
    />
  );
});

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};
