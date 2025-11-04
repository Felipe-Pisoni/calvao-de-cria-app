import Link from "next/link";
import { LogoIcon } from "../LogoIcon";

export const AuthHeader = () => {
  return (
    <div className="px-4 w-full h-16 bg-primary justify-center shadow-md flex gap-4 ">
      <div className="w-full max-w-7xl mx-auto ">
        <Link className="absolute" href="/">
          <LogoIcon />
        </Link>
      </div>
    </div>
  );
};
