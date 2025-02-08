import React from 'react';
import { cn } from '@/lib/util';


export const Label = ({ className, htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700",
        className
      )}
    >
      {children}
    </label>
  );
};
