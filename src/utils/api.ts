import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { cookieUtils, AUTH_COOKIE_KEYS, COOKIE_EXPIRY } from "./cookieUtils";

export const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        `https://apicalvaodecria-production.up.railway.app/api/v1`,
});

// Interface para armazenar requisições que falharam
interface FailedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}

// Fila de requisições que falharam
let failedRequestsQueue: FailedRequest[] = [];
let isRefreshing = false;

// Função para renovar o token
const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = cookieUtils.get(AUTH_COOKIE_KEYS.REFRESH_TOKEN);
  console.log("🚀 ~ refreshAuthToken ~ refreshToken:", refreshToken)
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken }
    );
    console.log("🚀 ~ refreshAuthToken ~ response:", response)
    
    const { accessToken } = response.data.data;
    
    // Salvar o novo token
    cookieUtils.set(
      AUTH_COOKIE_KEYS.ACCESS_TOKEN,
      accessToken,
      COOKIE_EXPIRY.ACCESS_TOKEN
    );
    
    // Atualizar o header de autorização
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return accessToken;
  } catch (error) {
    // Se o refresh token também falhou, limpar todos os tokens
    cookieUtils.removeMultiple([
      AUTH_COOKIE_KEYS.ACCESS_TOKEN,
      AUTH_COOKIE_KEYS.REFRESH_TOKEN,
      AUTH_COOKIE_KEYS.USER,
    ]);
    delete api.defaults.headers.common['Authorization'];
    
    // Redirecionar para login se estivermos no browser
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    
    return null;
  }
};

// Interceptador de requisição para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = cookieUtils.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para lidar com erros 401
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const originalRequest = error.config;
    console.log("🚀 ~ originalRequest:", originalRequest)

    // Se o erro é 401 e não é uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🚀 ~ isRefreshing:", isRefreshing)
      if (isRefreshing) {
        // Se já estamos renovando o token, adicionar esta requisição à fila
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        console.log("🚀 ~ newToken:", newToken)
        
        if (newToken) {
          // Processar todas as requisições na fila
          failedRequestsQueue.forEach((({ resolve, config }) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(config));
          }));
          
          // Limpar a fila
          failedRequestsQueue = [];
          
          // Repetir a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Se não conseguiu renovar o token, rejeitar todas as requisições na fila
          failedRequestsQueue.forEach(({ reject }) => {
            reject(error);
          });
          failedRequestsQueue = [];
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Se houve erro no refresh, rejeitar todas as requisições na fila
        failedRequestsQueue.forEach(({ reject }) => {
          reject(refreshError);
        });
        failedRequestsQueue = [];
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Tratar outros erros de resposta
    if (error.response) {
      console.error("Erro na resposta da API:", error.response.data);
    } else {
      console.error("Erro ao fazer a requisição:", error.message);
    }
    
    return Promise.reject(error);
  }
);
