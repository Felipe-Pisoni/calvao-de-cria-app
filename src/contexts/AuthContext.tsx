import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  User,
  AuthContextType,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from "../types";
import { authService, setAuthToken } from "../services/authService";
import {
  cookieUtils,
  AUTH_COOKIE_KEYS,
  COOKIE_EXPIRY,
} from "../utils/cookieUtils";

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Props do provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para salvar tokens nos cookies
  const saveTokens = (accessToken: string, refreshToken: string) => {
    cookieUtils.set(
      AUTH_COOKIE_KEYS.ACCESS_TOKEN,
      accessToken,
      COOKIE_EXPIRY.ACCESS_TOKEN
    );
    cookieUtils.set(
      AUTH_COOKIE_KEYS.REFRESH_TOKEN,
      refreshToken,
      COOKIE_EXPIRY.REFRESH_TOKEN
    );
    setAuthToken(accessToken);
  };



  // Função para remover tokens dos cookies
  const clearTokens = () => {
    cookieUtils.removeMultiple([
      AUTH_COOKIE_KEYS.ACCESS_TOKEN,
      AUTH_COOKIE_KEYS.REFRESH_TOKEN,
      AUTH_COOKIE_KEYS.USER,
    ]);
    setAuthToken(null);
  };

  // Função para salvar usuário nos cookies
  const saveUser = async () => {
    const user = await authService.getCurrentUser();
    cookieUtils.set(
      AUTH_COOKIE_KEYS.USER,
      JSON.stringify(user),
      COOKIE_EXPIRY.USER
    );
    setUser(user);
  };

  // Função de login
  const login = async (data: LoginData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      console.log("🚀 ~ login ~ response:", response);
      const { tokens } = response;
      saveTokens(tokens.accessToken, tokens.refreshToken);
      await saveUser();
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      const { tokens } = response.data;
      saveTokens(tokens.accessToken, tokens.refreshToken);
      await saveUser();
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      if (user) {
        await authService.logout(user.id);
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  // Função para esqueci minha senha
  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      await authService.forgotPassword(data);
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      throw error;
    }
  };

  // Função para redefinir senha
  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    try {
      await authService.resetPassword(data);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      throw error;
    }
  };



  // Função para carregar usuário dos cookies
  const loadUserFromCookies = async () => {
    try {
      const storedUser = cookieUtils.get(AUTH_COOKIE_KEYS.USER);
      const storedAccessToken = cookieUtils.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN);

      if (storedUser && storedAccessToken) {
        try {
          // Tentar fazer parse do usuário armazenado
          setAuthToken(storedAccessToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          try {
            await saveUser();
          } catch (error) {
            console.warn("Token inválido, será renovado automaticamente nas próximas requisições");
            // O token será renovado automaticamente pelo interceptador da API
            // Por enquanto, apenas definimos o usuário com os dados salvos
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (parseError) {
              console.error("Erro ao fazer parse dos dados do usuário:", parseError);
              clearTokens();
              setUser(null);
            }
          }
        } catch (parseError) {
          console.error(
            "Erro ao fazer parse dos dados do usuário:",
            parseError
          );
          clearTokens();
          setUser(null);
        }
      } else {
        console.log("Nenhum usuário ou token encontrado nos cookies");
      }
    } catch (error) {
      console.error("Erro ao carregar usuário dos cookies:", error);
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar usuário quando o componente monta
  useEffect(() => {
    loadUserFromCookies();
  }, []);

  // O interceptador de refresh automático de token já está implementado no api.ts

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
