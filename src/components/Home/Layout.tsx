"use client";

import { useState } from "react";
import { Header } from "./Header";
import { ShoppingCartDrawer } from "./ShoppingCartDrawer";

const Layout = ({ children }:{children: React.ReactNode}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="min-h-screen text-text-primary bg-background">
        {/* Header */}
        <Header toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <main className="h-[calc(100vh-4rem)] overflow-y-auto flex-1">
          <div className="max-w-7xl mx-auto py-12">
            {children}
          </div>
        </main>
      </div>
      <ShoppingCartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};
// const ShoppingCartDrawer = ({
//   isDrawerOpen,
//   closeDrawer,
// }: {
//   isDrawerOpen: boolean;
//   closeDrawer: () => void;
// }) => {
//   return createPortal(
//     <Drawer
//       open={isDrawerOpen}
//       onClose={closeDrawer}
//       direction="left"
//       className="drawer"
//     >
//       <div className="bg-items-bg z-10 h-full w-64 shadow-lg">
//         <div className="p-4">
//           <h2 className="text-lg font-semibold text-text-primary mb-4">Menu</h2>
//           <nav className="space-y-2">
//             <Link
//               to="/"
//               onClick={closeDrawer}
//               className="block px-3 py-2 rounded-md text-text-primary hover:bg-primary hover:text-white transition-colors"
//             >
//               Home
//             </Link>
//             <Link
//               to="/about"
//               onClick={closeDrawer}
//               className="block px-3 py-2 rounded-md text-text-primary hover:bg-primary hover:text-white transition-colors"
//             >
//               About
//             </Link>
//           </nav>
//         </div>
//       </div>
//     </Drawer>,
//     document.getElementById("shopping-cart-modal")!
//   );
// };
export default Layout;
