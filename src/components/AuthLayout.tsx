import { Outlet } from "react-router-dom";
import { AuthHeader } from "./AuthHeader";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex justify-center items-center p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
