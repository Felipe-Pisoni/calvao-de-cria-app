import type { ReactNode } from "react";

interface AuthPageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export const AuthPageWrapper = ({
  children,
  title,
  subtitle,
}: AuthPageWrapperProps) => (
  <div className="w-full bg-white max-w-md mx-auto bg-items-bg p-8 rounded-xl shadow-lg">
    <h1 className=" text-2xl font-semibold text-center text-text-primary mb-6">
      {title}
    </h1>
    {subtitle && (
      <p className="text-center text-text-secondary mb-8">{subtitle}</p>
    )}
    <div className="space-y-6">{children}</div>
  </div>
);
