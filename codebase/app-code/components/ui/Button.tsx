import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-on-primary hover:bg-primary/90 shadow-lg",
      secondary: "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-md",
      outline: "border-2 border-outline-variant bg-transparent text-primary hover:bg-surface-container-low",
      ghost: "bg-transparent text-on-surface-variant hover:bg-on-primary/5",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-md",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-6 text-sm",
      lg: "h-14 px-8 text-lg",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
