"use client";

import { ProfileProvider } from "@/libs/contexts/ProfileContext";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    { to: "/profile/settings", label: "Meus dados" },
    { to: "/profile/orders", label: "Meus pedidos" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
      <aside className="w-full md:w-64 bg-items-bg p-4 rounded-lg shadow-md self-start">
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={classNames(
                "px-4 py-2 rounded-md text-left transition-colors duration-200",
                {
                  "bg-primary text-white": pathname === link.to,
                  "text-text-primary hover:bg-gray-100": pathname !== link.to,
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-grow bg-items-bg p-6 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProfileProvider>
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </ProfileProvider>
  );
};

export default SettingsLayout;
