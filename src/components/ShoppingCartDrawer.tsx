import { useNavigate } from "react-router-dom";
import { Button } from ".";
import type { CartItem } from "../types";
import { XIcon } from "@phosphor-icons/react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export const ShoppingCartDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Calcular total do carrinho
  const total =
    cart?.items?.reduce(
      (acc: number, item: CartItem) => acc + item.totalItemPrice,
      0
    ) || 0;

  const cartItems = cart?.items || [];

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      onClose();
      return;
    }
    navigate("/checkout");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      {/* Drawer Content */}
      <div
        className={`absolute top-0 right-0 h-full bg-itemsBackground w-full max-w-sm shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-text1 font-semibold cursor-pointer"
            >
              {/* </> */}
              <span>Voltar</span>
            </button>
          </div>
          <div className="divide-y divide-textSecondary flex-grow bg-background overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-textSecondary">
                <p className="text-lg mb-2">Seu carrinho está vazio</p>
                <p className="text-sm">Adicione produtos para continuar</p>
              </div>
            ) : (
              cartItems.map((item: CartItem) => (
                <ProductRowItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateCartItem}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>
          <div className="p-4 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-text1">Total</span>
              <span className="text-xl font-bold text-primary">
                R$ {total?.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button 
              onClick={handleCheckout} 
              disabled={cartItems.length === 0}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductRowItemProps {
  item: CartItem;
  onUpdateQuantity: (
    productId: string,
    data: { quantity: number }
  ) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export const ProductRowItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: ProductRowItemProps) => {
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await onRemove(item.productId);
    } else {
      await onUpdateQuantity(item.productId, { quantity: newQuantity });
    }
  };

  const handleRemove = async () => {
    await onRemove(item.productId);
  };

  return (
    <div className="text-text1 flex items-center gap-4 mb-4 pb-4">
      <img
        src={item.mainImageUrl}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-md"
      />

      <div className="flex-grow flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium leading-tight">{item.name}</h3>
          <button className="rounded-full" onClick={handleRemove}>
            <XIcon />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Counter
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
          />
          <span className="text-lg font-bold text-primary">
            R$ {item.totalItemPrice?.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
};
interface CounterProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const Counter = ({ quantity, onQuantityChange }: CounterProps) => {
  const handleDecrease = () => {
    onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center border w-24 justify-center border-text1 rounded px-1 bg-white">
      <button
        onClick={handleDecrease}
        className="h-5 w-5 rounded-full hover:bg-background transition-color flex items-center justify-center"
      >
        −
      </button>
      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        className="h-5 w-5 rounded-full hover:bg-background transition-color flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
};
