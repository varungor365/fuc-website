/**
 * Badge UI Component
 */
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-500 text-white border-transparent",
    secondary: "bg-gray-500 text-white border-transparent",
    destructive: "bg-red-500 text-white border-transparent",
    outline: "bg-transparent text-gray-300 border-gray-600"
  }

  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <div className={classes} {...props} />
  )
}

export { Badge }