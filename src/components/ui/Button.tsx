import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "outline"
    | "link"
    | "icon"; // Tambahkan 'icon'
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
      secondary:
        "bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500",
      accent:
        "bg-accent-600 hover:bg-accent-700 text-white focus:ring-accent-500",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
      outline:
        "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
      link: "bg-transparent underline hover:text-primary-700 text-primary-600 p-0 focus:ring-0 shadow-none",
      icon: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-primary-500 shadow-none p-2 rounded-full",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    // Untuk variant 'icon' dan 'link', kita mungkin tidak ingin padding default dari sizeClasses
    // Kecuali jika children-nya adalah teks. Jika hanya ikon, p-2 dari variant icon sudah cukup.
    const currentSizeClasses =
      (variant === "icon" && !children) || variant === "link"
        ? ""
        : sizeClasses[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
          variantClasses[variant],
          currentSizeClasses, // Gunakan size classes yang sudah disesuaikan
          (disabled || isLoading) && "opacity-50 cursor-not-allowed",
          variant !== "link" && variant !== "icon" && "shadow-sm", // Icon button juga tidak perlu shadow default
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        )}
        {/* Jika variant icon dan tidak ada children, jangan beri margin pada leftIcon */}
        {!isLoading && leftIcon && (
          <span className={variant === "icon" && !children ? "" : "mr-2"}>
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && rightIcon && <span className='ml-2'>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
