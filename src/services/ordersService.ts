import { api } from '../utils/api';
import type { Order } from '@/types';

export const ordersService = {
  // Listar pedidos do usuário - baseado na API administrativa
  // Como não há endpoint específico para usuário, assumindo que existe /users/me/orders
  getUserOrders: async (): Promise<Order[]> => {
    try {
      // Tentativa com endpoint específico do usuário
      const response = await api.get('/users/me/orders');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      // Fallback: retorna array vazio se não conseguir buscar
      return [];
    }
  },

  // Obter detalhes de um pedido específico
  getOrderById: async (orderId: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/users/me/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      return null;
    }
  }
};