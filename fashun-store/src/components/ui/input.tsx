import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  const baseClasses = 'w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
  
  const classes = `${baseClasses} ${className}`;

  return <input className={classes} {...props} />;
}