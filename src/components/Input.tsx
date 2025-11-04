"use client";

import { EyeIcon, LockIcon } from "@phosphor-icons/react";
import { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder: string;
  type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  icon,
  rightIcon,
  placeholder,
  type = "text",
  ...props
}, ref) => (
  <div className="relative group">
    {icon && (
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-200 group-focus-within:text-primary">
        {icon}
      </span>
    )}
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`bg-white w-full py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        icon ? "pl-10" : "pl-3"
      } ${rightIcon ? "pr-10" : "pr-3"}`}
      {...props}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
));

Input.displayName = 'Input';
interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  placeholder?: string;
  icon?: React.ReactNode;
}

export const PasswordInput = ({
  placeholder = "Senha",
  icon,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const EyeIconComponent = () => (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="focus:outline-none"
    >
      <EyeIcon className="w-5 h-5 text-gray-500" />
    </button>
  );

  return (
    <Input
      icon={icon || <LockIcon />}
      rightIcon={<EyeIconComponent />}
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
      {...props}
    />
  );
};
