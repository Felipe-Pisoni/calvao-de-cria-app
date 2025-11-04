import axios from 'axios';
import { api } from '../utils/api';
import type { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ForgotPasswordData, 
  ResetPasswordData,
  User,
  AuthResponseData
} from '@/types';

// Função para configurar o token no header da API
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Serviços de autenticação
export const authService = {
  // Registrar novo usuário
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response as unknown as AuthResponse;
  },

  // Fazer login
  login: async (data: LoginData): Promise<AuthResponseData> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Fazer logout
  logout: async (userId: string): Promise<void> => {
    await api.post('/auth/logout', { _id: userId });
  },

  // Atualizar token (agora gerenciado automaticamente pela API)
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    // Esta função agora é usada apenas internamente pela API
    // O refresh automático é gerenciado pelo interceptador
    const response = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  // Esqueci minha senha
  forgotPassword: async (data: ForgotPasswordData): Promise<{ resetToken: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Redefinir senha
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await api.post(`/auth/reset-password/${data.token}`, {
      password: data.password,
      passwordConfirm: data.passwordConfirm
    });
  },

  // Buscar dados do usuário atual
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  }
};