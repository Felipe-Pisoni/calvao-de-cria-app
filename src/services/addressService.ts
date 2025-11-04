import { api } from '../utils/api';
import type { Address, CreateAddressData, UpdateAddressData } from '@/types';

export const addressService = {
  // Listar todos os endereços do usuário
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/users/me/addresses');
    return response.data;
  },

  // Obter detalhes de um endereço específico
  getAddressById: async (addressId: string): Promise<Address> => {
    const response = await api.get(`/users/me/addresses/${addressId}`);
    return response.data;
  },

  // Criar novo endereço
  createAddress: async (data: CreateAddressData): Promise<{ addressId: string }> => {
    const response = await api.post('/users/me/addresses', data);
    return response.data;
  },

  // Atualizar endereço existente
  updateAddress: async (addressId: string, data: UpdateAddressData): Promise<Address> => {
    const response = await api.patch(`/users/me/addresses/${addressId}`, data);
    return response.data;
  },

  // Deletar endereço
  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/users/me/addresses/${addressId}`);
  }
};