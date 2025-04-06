import { useNavigate, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
import LoadingButton from "~/components/ui/LoadingButton";

export default function DashboardError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  let message = "Ha ocurrido un error al cargar el dashboard.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    message = error.data.message || error.data;
    status = error.status;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleTryAgain = () => {
    navigate("/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <svg 
            className="w-16 h-16 text-red-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error {status}</h1>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">{message}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <LoadingButton
              onClick={handleTryAgain}
              variant="primary"
              size="md"
            >
              Intentar de nuevo
            </LoadingButton>
            
            <LoadingButton
              onClick={handleGoHome}
              variant="secondary"
              size="md"
            >
              Volver al inicio
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
} 