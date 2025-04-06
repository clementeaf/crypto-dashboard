import { memo } from 'react';
import { RequirementsPanelProps } from '~/types/types';

const RequirementsPanel = memo(function RequirementsPanel({ onClose }: RequirementsPanelProps
) {
  return (
    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">Requisitos cumplidos</h2>
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          aria-label="Cerrar panel de requisitos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <ul className="list-disc pl-5 space-y-2 text-green-800 dark:text-green-300">
        <li>
          <strong>✅ Lista de criptomonedas:</strong> Mostrando hasta 10 criptomonedas populares
          en un layout responsive de tarjetas.
        </li>
        <li>
          <strong>✅ Información por tarjeta:</strong>
          <ul className="list-circle pl-5 mt-1">
            <li>Nombre y símbolo de la criptomoneda</li>
            <li>Tipo de cambio actual a USD</li>
            <li>Tipo de cambio actual a Bitcoin (BTC)</li>
          </ul>
        </li>
        <li>
          <strong>✅ Actualización de datos:</strong>
          <ul className="list-circle pl-5 mt-1">
            <li>Actualización automática al cargar la página</li>
            <li>Actualización manual mediante botón "Actualizar datos"</li>
            <li>Opción de actualización automática con intervalos configurables</li>
          </ul>
        </li>
        <li>
          <strong>✅ Estados de interfaz:</strong>
          <ul className="list-circle pl-5 mt-1">
            <li>Estado de carga con indicadores visuales</li>
            <li>Manejo de errores con mensajes claros</li>
            <li>Datos de respaldo cuando la API falla</li>
          </ul>
        </li>
        <li>
          <strong>✅ Medidas de optimización:</strong>
          <ul className="list-circle pl-5 mt-1">
            <li>Sistema de caché para reducir solicitudes a la API (5 minutos de duración)</li>
            <li>Retrasos entre solicitudes para evitar rate limiting</li>
            <li>Manejo de errores con datos de respaldo</li>
            <li>Diagnóstico completo de API para facilitar depuración</li>
          </ul>
        </li>
        <li>
          <strong>✅ Sistema de autenticación:</strong>
          <ul className="list-circle pl-5 mt-1">
            <li>Login con nombre de usuario y contraseña (admin/admin)</li>
            <li>Protección de rutas para usuarios no autenticados</li>
            <li>Función de cierre de sesión</li>
          </ul>
        </li>
      </ul>

      <p className="mt-3 text-sm text-green-800 dark:text-green-300">
        <strong>Nota:</strong> La API de Coinbase tiene límites de solicitudes (rate limits).
        Si experimentas problemas, usa el botón "Limpiar caché" y luego "Actualizar datos".
      </p>
    </div>
  );
});

export default RequirementsPanel; 