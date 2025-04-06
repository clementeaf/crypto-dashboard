import { memo } from 'react';
import { ApiDiagnosticsPanelProps } from '~/types/types';

// Componente memoizado para evitar renderizados innecesarios
const ApiDiagnosticsPanel = memo(function ApiDiagnosticsPanel({
  logs,
  apiTestResult,
  isTestingApi,
  isClearingCache,
  handleTestApi,
  handleClearCache,
  testApiUrl
}: ApiDiagnosticsPanelProps) {
  return (
    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Diagnóstico de API</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">Prueba de conexión:</p>
          <div className="flex gap-2">
            <button 
              onClick={handleClearCache}
              disabled={isClearingCache}
              className={`px-2 py-1 rounded text-sm ${
                isClearingCache 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isClearingCache ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Limpiando...
                </span>
              ) : 'Limpiar caché'}
            </button>
            <button 
              onClick={handleTestApi}
              disabled={isTestingApi}
              className={`px-2 py-1 rounded text-sm ${
                isTestingApi 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isTestingApi ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Probando...
                </span>
              ) : 'Probar conexión'}
            </button>
          </div>
        </div>
        
        <div className="p-3 mb-3 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded-lg">
          <p className="text-sm mb-1">
            <strong>¿Por qué ocurren timeouts?</strong> La API pública de Coinbase tiene límites 
            de tasa (rate limiting) para protegerse contra abusos. Al hacer muchas solicitudes 
            simultáneas, alcanzamos estos límites y Coinbase empieza a rechazar nuestras peticiones.
          </p>
          <p className="text-sm">
            <strong>Solución:</strong> Hemos implementado un sistema de caché y retrasos entre solicitudes
            para evitar alcanzar estos límites. Los datos se almacenan por 5 minutos antes de volver a 
            solicitar nueva información.
          </p>
        </div>
        
        {apiTestResult && (
          <div className={`p-3 rounded-lg text-sm ${
            apiTestResult.success 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
          }`}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">
                {apiTestResult.success ? '✅ Conexión exitosa' : '❌ Error de conexión'}
              </span>
              <span className="text-xs opacity-70">{apiTestResult.timestamp}</span>
            </div>
            
            {apiTestResult.success ? (
              <>
                <p>Código de estado: {apiTestResult.statusCode}</p>
                <p>Tiempo de respuesta: {apiTestResult.responseTime}ms</p>
                {apiTestResult.data && (
                  <div className="mt-1">
                    <p className="font-medium text-xs">Datos de respuesta:</p>
                    <pre className="text-xs mt-1 bg-white/20 p-1 rounded overflow-x-auto">
                      {JSON.stringify(apiTestResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>Error: {apiTestResult.error}</p>
                {apiTestResult.statusCode && <p>Código de estado: {apiTestResult.statusCode}</p>}
                {apiTestResult.responseTime && <p>Tiempo de respuesta: {apiTestResult.responseTime}ms</p>}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="mb-1">Prueba manual de API:</p>
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            readOnly 
            value={testApiUrl} 
            className="flex-1 p-1 border rounded text-sm bg-gray-50 dark:bg-gray-900"
          />
          <button 
            onClick={() => window.open(testApiUrl, '_blank')}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
          >
            Probar en nueva pestaña
          </button>
        </div>
      </div>
      
      <h3 className="font-medium mb-1">Logs:</h3>
      <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs h-40 overflow-auto">
        {logs.length === 0 ? 'No hay logs disponibles. Haz clic en "Actualizar datos" para generar logs.' : 
          logs.map((log, index) => (
            <div key={index} className={
              log.includes('[ERROR]') ? 'text-red-500' : 
              log.includes('[CACHE]') ? 'text-blue-500' : 
              log.includes('[AUTO]') ? 'text-purple-500' :
              ''
            }>
              {log}
            </div>
          ))
        }
      </pre>
    </div>
  );
});

export default ApiDiagnosticsPanel; 