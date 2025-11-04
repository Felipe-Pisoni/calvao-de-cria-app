import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import ShoppingCartIcon from "../assets/ShoppingCart.svg";
import UserIcon from "../assets/User.svg";
import { LogoIcon } from "./LogoIcon";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export const Header = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Calcular total de itens no carrinho
  const cartItemsCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate("/auth/login");
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);
  return (
    <div className="p-4 w-full h-16 bg-primary shadow-md flex justify-center">
      <div className="w-full max-w-7xl flex justify-between items-center">
        <div>
          <Link to="/">
            <LogoIcon />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Tabs />
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative flex items-center justify-center" ref={userMenuRef}>
            <button 
              onClick={handleUserIconClick} 
              className="relative rounded-full hover:opacity-80 transition-opacity"
            >
              {!isAuthenticated && (
                <img className="h-10" src={UserIcon} alt="User" />
              )}
              {isAuthenticated && user && (
                <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-white transition-all">
                  <span>
                    {user.name
                      ?.split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                </div>
              )}
            </button>
            
            {/* Menu dropdown */}
            {isAuthenticated && showUserMenu && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate("/profile/settings");
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Meu Perfil
                </button>
                <button
                  onClick={() => {
                    navigate("/profile/orders");
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Meus Pedidos
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
          
          <button onClick={toggleDrawer} className="relative">
            <img className="h-10" src={ShoppingCartIcon} alt="Cart" />
            {cartItemsCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount > 9 ? "9+" : cartItemsCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
interface LineI {
  left: number;
  width: number;
}
interface TabI {
  key: string;
  name: string;
}
function Tabs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const headerTabs: TabI[] = [
    { name: "Produtos", key: "products" },
    {
      name: "Promoções",
      key: "offers",
    },
  ];
  
  // Ler a aba ativa da URL ou usar "products" como padrão
  const activeTabKey = searchParams.get('tab') || 'products';
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [line, setLine] = useState<LineI>({ left: 0, width: 0 });

  function handleSetLine(): void {
    if (!activeTabRef.current) return;
    const { clientWidth, offsetLeft } = activeTabRef.current;
    setLine({
      left: offsetLeft,
      width: clientWidth,
    });
  }

  const handleTabClick = (key: string) => {
    if (key === "products") {
      // Navegar para home sem parâmetro tab (produtos)
      navigate("/");
    } else if (key === "offers") {
      // Navegar para ofertas com parâmetro tab
      navigate("/?tab=offers");
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleSetLine();
  }, [activeTabKey]);

  return (
    <div className="flex relative items-center gap-12">
      {headerTabs.map(({ name, key }) => {
        const isActiveKey = key === activeTabKey;
        return (
          <button
            type="button"
            onClick={() => handleTabClick(key)}
            ref={isActiveKey ? activeTabRef : null}
            key={key}
            className="text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span>{name}</span>
          </button>
        );
      })}
      <div
        style={{
          width: line.width,
          left: line.left,
        }}
        className="absolute -bottom-2 h-[2px] bg-white transition-all duration-300 "
      />
    </div>
  );
}
