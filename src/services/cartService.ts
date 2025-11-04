import { api } from "../utils/api";
import type { Cart, AddToCartData, UpdateCartItemData } from "@/types";

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      throw error;
    }
  },

  async addToCart(data: AddToCartData): Promise<Cart> {
    try {
      const response = await api.post("/cart/items", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      throw error;
    }
  },

  async updateCartItem(
    productId: string,
    data: UpdateCartItemData
  ): Promise<Cart> {
    try {
      const response = await api.put(`/cart/items/${productId}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar item do carrinho:", error);
      throw error;
    }
  },

  async removeFromCart(productId: string): Promise<Cart> {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw error;
    }
  },
};
