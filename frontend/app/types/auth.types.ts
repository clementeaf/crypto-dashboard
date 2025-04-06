/**
 * Tipos relacionados con la autenticación
 */

// Tipo para el usuario autenticado
export type AuthUser = {
  username: string;
  timestamp: string;
} | null;

// Tipo para el contexto de autenticación
export interface AuthContextType {
  user: AuthUser;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Tipo para los datos almacenados en sessionStorage
export interface AuthData {
  isAuthenticated: boolean;
  username: string;
  timestamp: string;
}

// Tipo para los datos de la acción de login
export interface LoginActionData {
  success: boolean; 
  error?: string;
  username?: string;
  password?: string;
} 