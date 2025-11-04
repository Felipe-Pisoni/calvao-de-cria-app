// Utilitários para gerenciar cookies de forma segura
export const cookieUtils = {
  // Verificar se estamos no browser
  isBrowser: (): boolean => typeof window !== 'undefined',

  // Definir cookie com configurações de segurança
  set: (name: string, value: string, days = 7): void => {
    if (!cookieUtils.isBrowser()) return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    // Configurações de segurança do cookie
    const isSecure = window.location.protocol === 'https:';
    const cookieString = [
      `${name}=${encodeURIComponent(value)}`,
      `expires=${expires.toUTCString()}`,
      'path=/',
      isSecure ? 'secure' : '',
      'samesite=strict'
    ].filter(Boolean).join(';');
    
    document.cookie = cookieString;
  },

  // Obter valor do cookie
  get: (name: string): string | null => {
    if (!cookieUtils.isBrowser()) return null;
    
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        try {
          return decodeURIComponent(c.substring(nameEQ.length));
        } catch (error) {
          console.error(`Erro ao decodificar cookie ${name}:`, error);
          return null;
        }
      }
    }
    return null;
  },

  // Remover cookie
  remove: (name: string): void => {
    if (!cookieUtils.isBrowser()) return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  // Verificar se um cookie existe
  exists: (name: string): boolean => {
    return cookieUtils.get(name) !== null;
  },

  // Remover múltiplos cookies
  removeMultiple: (names: string[]): void => {
    names.forEach(name => cookieUtils.remove(name));
  }
};

// Chaves específicas para cookies de autenticação
export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token", 
  USER: "auth_user",
} as const;

// Configurações de tempo de vida dos cookies
export const COOKIE_EXPIRY = {
  ACCESS_TOKEN: 1, // 1 dia
  REFRESH_TOKEN: 7, // 7 dias
  USER: 7, // 7 dias
} as const;