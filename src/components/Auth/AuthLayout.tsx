import { AuthHeader } from "./AuthHeader";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex justify-center items-center p-4">
        {children}
      </div>
    </div>
  );
};
