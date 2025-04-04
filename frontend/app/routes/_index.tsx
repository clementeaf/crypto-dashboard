import { json } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useCallback } from "react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getCryptocurrencies } from "~/services/crypto.service";
import { setLastRefreshTime } from "~/utils/storage";
import Dashboard from "~/components/layout/Dashboard";
import type { Cryptocurrency } from "~/types/crypto";

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard - Monitoreo de criptomonedas en tiempo real" },
    { name: "description", content: "Dashboard para monitorear tasas de cambio de criptomonedas en tiempo real" },
  ];
};

// Función loader para cargar datos de criptomonedas
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Obtener criptomonedas con nuestro servicio
    const cryptocurrencies = await getCryptocurrencies();
    
    // Registrar el tiempo de actualización (esto se ejecutará en el cliente)
    if (typeof window !== "undefined") {
      setLastRefreshTime();
    }
    
    return json({ 
      cryptocurrencies,
      error: null
    });
  } catch (error) {
    console.error("Error cargando datos de criptomonedas:", error);
    
    return json({
      cryptocurrencies: [],
      error: "Error al cargar datos de criptomonedas. Por favor, intenta nuevamente."
    });
  }
}

export default function Index() {
  // Obtener datos del loader
  const { cryptocurrencies, error } = useLoaderData<typeof loader>();
  
  // Obtener el revalidator para actualizar los datos
  const revalidator = useRevalidator();
  
  // Callback para actualizar los datos
  const handleRefresh = useCallback(() => {
    revalidator.revalidate();
  }, [revalidator]);
  
  return (
    <Dashboard 
      cryptocurrencies={cryptocurrencies as unknown as Cryptocurrency[]}
      onRefresh={handleRefresh}
      error={error}
    />
  );
}
