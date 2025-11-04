import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const Button = ({
  children,
  onClick,
  href,
  size = "medium",
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    small: "text-sm py-1 px-2 max-w-48 max-h-8",
    medium: "text-base py-2 px-4",
    large: "text-lg py-3 px-6",
  };

  const baseClasses =
    "w-full flex items-center justify-center text-center rounded-md transition-opacity duration-200 hover:opacity-90";
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    outline: "bg-transparent text-secondary border border-secondary",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${
    variants[variant]
  } ${className || ""}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
