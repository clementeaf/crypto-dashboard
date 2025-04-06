import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

// Redirigir a /login como vista por defecto
export const loader: LoaderFunction = async () => {
  return redirect("/login");
};
