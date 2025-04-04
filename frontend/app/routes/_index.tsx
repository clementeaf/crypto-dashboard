import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { isAuthenticated } from "~/utils/auth";

// Función loader para redirigir a dashboard o login
export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar si el usuario está autenticado
  const cookieHeader = request.headers.get("Cookie") || "";
  
  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated(cookieHeader)) {
    return redirect("/dashboard");
  }
  
  // Si no está autenticado, redirigir al login
  return redirect("/login");
}

// Componente de índice, no se debería renderizar nunca
export default function Index() {
  return null;
}
