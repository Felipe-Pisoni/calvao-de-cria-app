import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cartService } from "../services/cartService";
import type {
  Cart,
  CartContextType,
  AddToCartData,
  UpdateCartItemData,
} from "../types";
import { useAuth } from "./AuthContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Carregar carrinho do usuário logado
  const getCart = async () => {
    setIsLoading(true);
    try {
      const cartData = await cartService.getCart();
      console.log("🚀 ~ getCart ~ cartData:", cartData);
      setCart(cartData);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar item ao carrinho
  const addToCart = async (data: AddToCartData) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.addToCart(data);
      setCart(updatedCart);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar quantidade de item no carrinho
  const updateCartItem = async (
    productId: string,
    data: UpdateCartItemData
  ) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.updateCartItem(productId, data);
      setCart(updatedCart);
    } catch (error) {
      console.error("Erro ao atualizar item do carrinho:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remover item do carrinho
  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar carrinho localmente
  const clearCart = () => {
    setCart(null);
  };

  // Carregar carrinho quando o contexto é montado
  useEffect(() => {
    if (user) getCart();
  }, [user]);

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
