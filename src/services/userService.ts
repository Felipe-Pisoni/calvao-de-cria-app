import { api } from '../utils/api';
import type { User, UpdateUserData } from '@/types';

export const userService = {
  // Obter dados do perfil do usuário
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return {
      id: response.data.userId,
      name: response.data.name,
      email: response.data.email,
      cpf: response.data.cpf,
      birthDate: response.data.birthDate,
      phone: response.data.phone,
    };
  },

  // Atualizar dados do perfil
  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await api.patch('/users/me', data);
    return {
      id: response.data.userId,
      name: response.data.name,
      email: response.data.email,
      cpf: response.data.cpf,
      birthDate: response.data.birthDate,
      phone: response.data.phone,
    };
  }
};