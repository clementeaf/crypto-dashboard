import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ApiDiagnosticsPanel from '../ApiDiagnosticsPanel';
import type { ApiTestResultType } from '~/types/types';

// Datos de muestra para las pruebas
const mockLogs = [
  '[INFO] 2023-05-28 12:34:56 - Iniciando solicitud de datos',
  '[CACHE] 2023-05-28 12:34:57 - Datos recuperados desde caché',
  '[ERROR] 2023-05-28 12:35:10 - Timeout en la conexión API',
  '[AUTO] 2023-05-28 12:36:00 - Actualización automática'
];

const mockSuccessResult: ApiTestResultType = {
  success: true,
  timestamp: '2023-05-28 12:40:00',
  statusCode: 200,
  responseTime: 320,
  data: { name: 'bitcoin', price: 50000 }
};

const mockErrorResult: ApiTestResultType = {
  success: false,
  timestamp: '2023-05-28 12:45:00',
  error: 'Timeout al conectar con la API',
  statusCode: 408,
  responseTime: 3000
};

describe('ApiDiagnosticsPanel', () => {
  test('renderiza correctamente el panel con estado inicial', () => {
    const handleTestApi = vi.fn();
    const handleClearCache = vi.fn();
    
    render(
      <ApiDiagnosticsPanel
        logs={[]}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={handleTestApi}
        handleClearCache={handleClearCache}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que el título está presente
    expect(screen.getByText('Diagnóstico de API')).toBeInTheDocument();
    
    // Verificar que los botones están disponibles
    expect(screen.getByText('Probar conexión')).toBeInTheDocument();
    expect(screen.getByText('Limpiar caché')).toBeInTheDocument();
    
    // Verificar que muestra el mensaje de no logs
    expect(screen.getByText('No hay logs disponibles. Haz clic en "Actualizar datos" para generar logs.')).toBeInTheDocument();
    
    // Verificar que muestra la URL de prueba
    expect(screen.getByDisplayValue('https://api.example.com/test')).toBeInTheDocument();
  });

  test('renderiza correctamente el panel con logs', () => {
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que muestra los logs
    expect(screen.getByText(/\[INFO\] 2023-05-28 12:34:56/)).toBeInTheDocument();
    expect(screen.getByText(/\[CACHE\] 2023-05-28 12:34:57/)).toBeInTheDocument();
    expect(screen.getByText(/\[ERROR\] 2023-05-28 12:35:10/)).toBeInTheDocument();
    expect(screen.getByText(/\[AUTO\] 2023-05-28 12:36:00/)).toBeInTheDocument();
  });

  test('muestra los resultados exitosos de la prueba de API', () => {
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={mockSuccessResult}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que muestra los resultados exitosos
    expect(screen.getByText('✅ Conexión exitosa')).toBeInTheDocument();
    expect(screen.getByText('Código de estado: 200')).toBeInTheDocument();
    expect(screen.getByText('Tiempo de respuesta: 320ms')).toBeInTheDocument();
    expect(screen.getByText(/Datos de respuesta:/)).toBeInTheDocument();
    
    // Verificar que muestra los datos de la respuesta
    const responseData = screen.getByText(/"name": "bitcoin"/);
    expect(responseData).toBeInTheDocument();
  });

  test('muestra los resultados de error de la prueba de API', () => {
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={mockErrorResult}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que muestra los resultados de error
    expect(screen.getByText('❌ Error de conexión')).toBeInTheDocument();
    expect(screen.getByText('Error: Timeout al conectar con la API')).toBeInTheDocument();
    expect(screen.getByText('Código de estado: 408')).toBeInTheDocument();
    expect(screen.getByText('Tiempo de respuesta: 3000ms')).toBeInTheDocument();
  });

  test('muestra spinner durante la prueba de API', () => {
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={true}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que muestra el texto de carga
    expect(screen.getByText('Probando...')).toBeInTheDocument();
    
    // Verificar que el botón está deshabilitado
    const testButton = screen.getByText('Probando...').closest('button');
    expect(testButton).toBeDisabled();
    
    // Verificar que el spinner está presente
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThanOrEqual(1);
  });

  test('muestra spinner durante la limpieza de caché', () => {
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={true}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Verificar que muestra el texto de limpieza
    expect(screen.getByText('Limpiando...')).toBeInTheDocument();
    
    // Verificar que el botón está deshabilitado
    const clearButton = screen.getByText('Limpiando...').closest('button');
    expect(clearButton).toBeDisabled();
  });

  test('llama a handleTestApi cuando se hace clic en Probar conexión', () => {
    const handleTestApi = vi.fn();
    
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={handleTestApi}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Hacer clic en el botón de prueba
    const testButton = screen.getByText('Probar conexión');
    fireEvent.click(testButton);
    
    // Verificar que se llamó a la función
    expect(handleTestApi).toHaveBeenCalledTimes(1);
  });

  test('llama a handleClearCache cuando se hace clic en Limpiar caché', () => {
    const handleClearCache = vi.fn();
    
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={handleClearCache}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Hacer clic en el botón de limpiar caché
    const clearButton = screen.getByText('Limpiar caché');
    fireEvent.click(clearButton);
    
    // Verificar que se llamó a la función
    expect(handleClearCache).toHaveBeenCalledTimes(1);
  });

  test('abre una nueva pestaña al hacer clic en Probar en nueva pestaña', () => {
    // Mock window.open
    const openMock = vi.fn();
    window.open = openMock;
    
    render(
      <ApiDiagnosticsPanel
        logs={mockLogs}
        apiTestResult={null}
        isTestingApi={false}
        isClearingCache={false}
        handleTestApi={vi.fn()}
        handleClearCache={vi.fn()}
        testApiUrl="https://api.example.com/test"
      />
    );
    
    // Hacer clic en el botón de probar en nueva pestaña
    const openButton = screen.getByText('Probar en nueva pestaña');
    fireEvent.click(openButton);
    
    // Verificar que se llamó a window.open con la URL correcta
    expect(openMock).toHaveBeenCalledWith('https://api.example.com/test', '_blank');
  });
}); 