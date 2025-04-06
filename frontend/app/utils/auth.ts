/**
 * Utilidad simple para manejo de autenticación
 * Nota: Esta es una implementación básica para propósitos de demostración
 * En un entorno de producción, se utilizaría una solución más robusta
 */

// Clave para almacenar el estado de autenticación en sessionStorage
const AUTH_KEY = 'crypto_dashboard_auth';

/**
 * Inicia sesión con credenciales específicas
 * @param username Nombre de usuario
 * @param password Contraseña
 * @returns boolean indicando si el login fue exitoso
 */
export function login(username: string, password: string): boolean {
  // Verificar credenciales (hardcodeadas como admin/admin)
  const isValid = username === 'admin' && password === 'admin';
  
  console.log('auth.ts: Verificando credenciales', { username, isValid });
  
  if (isValid) {
    // Guardar estado de autenticación
    const authData = JSON.stringify({
      isAuthenticated: true,
      username,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Intentar guardar en sessionStorage
      sessionStorage.setItem(AUTH_KEY, authData);
      console.log('auth.ts: Auth data guardada en sessionStorage');
      
      // Verificar que se haya guardado correctamente
      const storedData = sessionStorage.getItem(AUTH_KEY);
      if (!storedData) {
        console.error('auth.ts: Fallo al guardar en sessionStorage');
        return false;
      }
    } catch (error) {
      console.error('auth.ts: Error al guardar en sessionStorage', error);
      return false;
    }
  }
  
  return isValid;
}

/**
 * Cierra la sesión del usuario actual
 */
export function logout(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY);
    console.log('auth.ts: Sesión cerrada');
  } catch (error) {
    console.error('auth.ts: Error al cerrar sesión', error);
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns boolean indicando si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  try {
    const authData = sessionStorage.getItem(AUTH_KEY);
    
    if (!authData) {
      console.log('auth.ts: No hay datos de autenticación');
      return false;
    }
    
    const { isAuthenticated } = JSON.parse(authData);
    console.log('auth.ts: Estado de autenticación:', isAuthenticated);
    return Boolean(isAuthenticated);
  } catch (e) {
    // Si hay un error al parsear JSON, limpiar y devolver false
    console.error('auth.ts: Error al verificar autenticación', e);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('auth.ts: Error al limpiar datos de autenticación', error);
    }
    return false;
  }
}

/**
 * Obtiene información del usuario autenticado
 * @returns Objeto con datos del usuario o null si no está autenticado
 */
export function getAuthUser(): { username: string; timestamp: string } | null {
  try {
    if (!isAuthenticated()) {
      console.log('auth.ts: getAuthUser - Usuario no autenticado');
      return null;
    }
    
    const authData = sessionStorage.getItem(AUTH_KEY);
    if (!authData) {
      console.log('auth.ts: getAuthUser - No hay datos de autenticación');
      return null;
    }
    
    const parsed = JSON.parse(authData);
    console.log('auth.ts: getAuthUser - Datos obtenidos:', parsed);
    return { 
      username: parsed.username,
      timestamp: parsed.timestamp
    };
  } catch (e) {
    console.error('auth.ts: Error al obtener datos del usuario', e);
    return null;
  }
} 