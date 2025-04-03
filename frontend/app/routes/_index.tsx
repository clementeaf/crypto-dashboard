import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getCryptocurrencies } from "~/services/crypto.service";
import { setLastRefreshTime } from "~/utils/storage";
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
  
  // Obtener estado de navegación para mostrar indicadores de carga
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Cargando datos de criptomonedas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div>
          <p className="mb-6">
            {cryptocurrencies.length} criptomonedas encontradas
          </p>
          
          {/* Aquí irán los componentes para mostrar las criptomonedas */}
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(cryptocurrencies, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
