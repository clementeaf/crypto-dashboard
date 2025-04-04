/**
 * Utilidades para manejar la autenticación
 */

// Constantes
const AUTH_COOKIE_NAME = 'isAuthenticated';
const AUTH_COOKIE_VALUE = 'true';
const AUTH_COOKIE_MAX_AGE = 86400; // 24 horas

/**
 * Verifica si el usuario está autenticado basado en las cookies
 * @param cookieHeader - El encabezado Cookie de la solicitud HTTP
 * @returns boolean - true si está autenticado, false si no
 */
export function isAuthenticated(cookieHeader: string): boolean {
  return cookieHeader
    .split(';')
    .some((cookie) => 
      cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`)
    );
}

/**
 * Crea un encabezado para establecer la cookie de autenticación
 * @returns string - El valor del encabezado Set-Cookie
 */
export function createAuthCookie(): string {
  return `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Crea un encabezado para eliminar la cookie de autenticación
 * @returns string - El valor del encabezado Set-Cookie para eliminar la cookie
 */
export function createLogoutCookie(): string {
  return `${AUTH_COOKIE_NAME}=false; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Establece la cookie de autenticación en el navegador
 */
export function setAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = createAuthCookie();
  }
}

/**
 * Elimina la cookie de autenticación en el navegador
 */
export function removeAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = createLogoutCookie();
  }
}

/**
 * Verifica si las credenciales proporcionadas son válidas
 * @param username - El nombre de usuario proporcionado
 * @param password - La contraseña proporcionada
 * @returns boolean - true si las credenciales son válidas, false si no
 */
export function validateCredentials(username: string, password: string): boolean {
  return username === 'admin' && password === 'admin';
} 