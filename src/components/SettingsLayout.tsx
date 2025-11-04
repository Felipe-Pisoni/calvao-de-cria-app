import { Link, Outlet, useLocation } from "react-router-dom";
import classNames from "classnames";
import { ProfileProvider } from "../contexts/ProfileContext";

const SettingsLayoutContent = () => {
  const location = useLocation();

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
              to={link.to}
              className={classNames(
                "px-4 py-2 rounded-md text-left transition-colors duration-200",
                {
                  "bg-primary text-white": location.pathname === link.to,
                  "text-text-primary hover:bg-gray-100":
                    location.pathname !== link.to,
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-grow bg-items-bg p-6 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export const SettingsLayout = () => {
  return (
    <ProfileProvider>
      <SettingsLayoutContent />
    </ProfileProvider>
  );
};

export default SettingsLayout;
