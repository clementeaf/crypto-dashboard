import { Form, useActionData } from "@remix-run/react";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validateCredentials, createAuthCookie } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Crypto Dashboard" },
    { name: "description", content: "Ingresar al Crypto Dashboard" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // Validar campos vacíos
  if (!username || !password) {
    return json(
      { error: "Por favor complete todos los campos" },
      { status: 400 }
    );
  }

  // Validar credenciales (estático, usuario y contraseña hardcodeados)
  if (username === "admin" && password === "admin") {
    // Crear una cookie para mantener la sesión y redirigir al dashboard
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": "isAuthenticated=true; Path=/; Max-Age=86400; SameSite=Lax",
      },
    });
  }

  // Si las credenciales son inválidas, devolver error
  return json(
    { error: "Usuario o contraseña incorrectos" },
    { status: 401 }
  );
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crypto Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingrese sus credenciales para acceder
          </p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg p-4 mb-4 text-sm border border-red-200 dark:border-red-800/30">
              {actionData.error}
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>Credenciales de prueba:</p>
            <p className="font-medium">Usuario: admin</p>
            <p className="font-medium">Contraseña: admin</p>
          </div>
        </Form>
      </div>
    </div>
  );
} 