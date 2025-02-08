import React, { useState } from 'react';
import { cn } from '@/lib/util';

// Checkbox 组件
export const Checkbox = ({ checked, onCheckedChange, label }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  // 处理点击事件
  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer transition-colors ${
          isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'
        }`}
        onClick={handleChange}
      >
        {isChecked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {label && <label className="text-sm">{label}</label>}
    </div>
  );
};
