import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated, getAuthUser } from '~/utils/auth';
import { AuthUser, AuthContextType } from '~/types/auth.types';

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

  // Función para verificar y actualizar el estado de autenticación
  const checkAuthentication = useCallback(() => {
    const authenticated = isAuthenticated();
    
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      const userData = getAuthUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    
    return authenticated;
  }, []);

  // Comprobar autenticación inicial
  useEffect(() => {
    // Comprobar al inicio
    checkAuthentication();

    // Comprobar cuando hay cambios en el storage (por si se cierra sesión en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crypto_dashboard_auth' || e.key === null) {
        checkAuthentication();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthentication]);

  // Función de login memoizada
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Implementamos una verificación síncrona primero
    if (username !== 'admin' || password !== 'admin') {
      return false;
    }
    
    // Si las credenciales son correctas, simulamos un delay y actualizamos el estado
    return new Promise((resolve) => {
      setTimeout(() => {
        // Llamar a la función real de login que actualiza el sessionStorage
        const success = authLogin(username, password);
        
        if (success) {
          const userData = getAuthUser();
          setUser(userData);
          setIsLoggedIn(true);
        }
        
        resolve(success);
      }, 500);
    });
  }, []);

  // Función de logout memoizada
  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Función para verificar la autenticación memoizada
  const checkAuth = useCallback((): boolean => {
    return checkAuthentication();
  }, [checkAuthentication]);

  // Memoizar el valor del contexto para evitar renderizados innecesarios
  const value = useMemo(() => ({
    user,
    isLoggedIn,
    login,
    logout,
    checkAuth
  }), [user, isLoggedIn, login, logout, checkAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext; 