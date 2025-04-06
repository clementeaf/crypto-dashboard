import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated, getAuthUser } from '~/utils/auth';

// Definir tipos
type AuthUser = {
  username: string;
  timestamp: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
};

// Crear contexto con valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Comprobar autenticación inicial
  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated = isAuthenticated();
      console.log("Verificando autenticación:", authenticated);
      
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const userData = getAuthUser();
        console.log("Usuario autenticado:", userData);
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    // Comprobar al inicio
    checkAuthentication();

    // Comprobar cuando hay cambios en el storage (por si se cierra sesión en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      console.log("Storage cambiado:", e.key);
      if (e.key === 'crypto_dashboard_auth' || e.key === null) {
        checkAuthentication();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función de login
  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("AuthContext: Intentando login con", username);
    
    // Implementamos una verificación síncrona primero
    if (username !== 'admin' || password !== 'admin') {
      console.log("AuthContext: Credenciales incorrectas");
      return false;
    }
    
    // Si las credenciales son correctas, simulamos un delay y actualizamos el estado
    return new Promise((resolve) => {
      setTimeout(() => {
        // Llamar a la función real de login que actualiza el sessionStorage
        const success = authLogin(username, password);
        
        if (success) {
          const userData = getAuthUser();
          console.log("AuthContext: Login exitoso, usuario:", userData);
          setUser(userData);
          setIsLoggedIn(true);
        }
        
        resolve(success);
      }, 500);
    });
  };

  // Función de logout
  const logout = () => {
    console.log("AuthContext: Cerrando sesión");
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Función para verificar la autenticación
  const checkAuth = (): boolean => {
    const authenticated = isAuthenticated();
    console.log("Verificando autenticación:", authenticated);
    
    setIsLoggedIn(authenticated);
    
    if (authenticated && !user) {
      const userData = getAuthUser();
      setUser(userData);
    }
    
    return authenticated;
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext; 