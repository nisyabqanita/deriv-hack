import React from "react";
import { cn } from "@/lib/util";

export const Select = ({ className, name, value, onChange, children, ...props }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
