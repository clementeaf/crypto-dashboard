import { useState, useEffect } from "react";
import { Form, useNavigate, useActionData, useSubmit } from "@remix-run/react";
import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useAuth } from "~/context/AuthContext";
import { useTheme } from "~/root";
import LoadingButton from "~/components/ui/LoadingButton";
import { login as authLogin, isAuthenticated } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Crypto Dashboard" },
    { name: "description", content: "Accede a tu dashboard de criptomonedas" },
  ];
};

// Acción que se ejecuta en el servidor cuando se envía el formulario
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Validar credenciales (hardcoded para este ejemplo)
  if (username === "admin" && password === "admin") {
    // No podemos usar sessionStorage en el servidor, así que en su lugar
    // devolvemos un objeto que indica éxito y dejamos que el cliente maneje la autenticación
    return json({ success: true, username, password });
  }

  // Si las credenciales son incorrectas, devolver un error
  return json({ success: false, error: "Credenciales incorrectas" });
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const actionData = useActionData<{ success: boolean; error?: string; username?: string; password?: string }>();
  const submit = useSubmit();

  // Procesar resultado de acción en el servidor
  useEffect(() => {
    if (actionData?.success) {
      // Si el servidor validó las credenciales, login en el cliente y navegar
      setIsLoading(true);
      console.log("Autenticación correcta en el servidor, ejecutando login cliente...");
      console.log("Tema actual en login durante autenticación:", theme);
      
      // Ejecutar login en el cliente (esto actualizará sessionStorage)
      if (actionData.username && actionData.password) {
        login(actionData.username, actionData.password).then(success => {
          if (success) {
            console.log("Login cliente exitoso, navegando a dashboard...");
            // Mostrar mensaje de éxito
            setLoginSuccess(true);
            // Redirigir después de un breve retraso para mostrar el mensaje
            setTimeout(() => {
              // Guardamos explícitamente el tema actual antes de navegar
              localStorage.setItem('theme', theme);
              navigate("/dashboard", { replace: true });
            }, 1000);
          } else {
            console.error("Error al ejecutar login en cliente");
            setIsLoading(false);
          }
        });
      }
    } else if (actionData && !actionData.success) {
      console.log("Credenciales incorrectas");
      setIsLoading(false);
    }
  }, [actionData, login, navigate, theme]);

  // Verificar si ya estamos autenticados y redirigir directamente sin mostrar modal
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Usuario ya autenticado, redirigiendo a dashboard");
      // Guardamos explícitamente el tema actual antes de navegar
      localStorage.setItem('theme', theme);
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate, theme]);

  // Manejador para formulario directo (fallback si el Form de Remix no funciona)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Intentar login directo
    try {
      console.log("Intentando login directo");
      console.log("Tema actual en login durante envío de formulario:", theme);
      const success = await login(username, password);
      
      if (success) {
        console.log("Login exitoso, navegando a dashboard");
        // Mostrar mensaje de éxito
        setLoginSuccess(true);
        // Redirigir después de un breve retraso para mostrar el mensaje
        setTimeout(() => {
          // Guardamos explícitamente el tema actual antes de navegar
          localStorage.setItem('theme', theme);
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        console.log("Credenciales incorrectas");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error en login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Crypto Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Inicia sesión para acceder</p>
        </div>
        
        {/* Mostrar mensaje de éxito si el login fue exitoso */}
        {loginSuccess ? (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            <p className="font-medium">¡Inicio de sesión exitoso!</p>
            <p className="text-sm">Redirigiendo al dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            {actionData?.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {actionData.error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              variant="primary"
              fullWidth
              loadingText="Iniciando sesión..."
            >
              Iniciar sesión
            </LoadingButton>
            
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Credenciales de prueba: admin / admin</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 