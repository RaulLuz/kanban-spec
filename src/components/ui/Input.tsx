'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded border
            bg-white dark:bg-dark-grey
            text-black dark:text-white
            placeholder:text-medium-grey
            ${error 
              ? 'border-red' 
              : 'border-medium-grey border-opacity-25 focus:border-main-purple'
            }
            focus:outline-none
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
