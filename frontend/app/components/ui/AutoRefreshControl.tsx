import { memo } from 'react';

type AutoRefreshControlProps = {
  autoRefresh: boolean;
  refreshInterval: number;
  onToggleAutoRefresh: () => void;
  onChangeInterval: (interval: number) => void;
  disabled?: boolean;
};

const AutoRefreshControl = memo(function AutoRefreshControl({
  autoRefresh,
  refreshInterval,
  onToggleAutoRefresh,
  onChangeInterval,
  disabled = false
}: AutoRefreshControlProps) {
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeInterval(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
      <label className="flex items-center cursor-pointer" aria-disabled={disabled}>
        <div className="relative">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={autoRefresh}
            onChange={onToggleAutoRefresh}
            disabled={disabled}
            aria-label="Activar actualización automática"
          />
          <div 
            className={`block w-10 h-6 rounded-full ${
              disabled ? 'bg-gray-300 dark:bg-gray-600' : 
              autoRefresh ? 'bg-gray-600 dark:bg-gray-400' : 'bg-gray-400 dark:bg-gray-600'
            }`}
          ></div>
          <div 
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              autoRefresh ? 'transform translate-x-4' : ''
            }`}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">Auto</span>
      </label>
      
      <select
        className={`text-sm p-1 ${
          disabled ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : 
          'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
        } rounded`}
        value={refreshInterval}
        onChange={handleIntervalChange}
        disabled={disabled || !autoRefresh}
        aria-label="Intervalo de actualización automática"
      >
        <option value="30">30s</option>
        <option value="60">1m</option>
        <option value="300">5m</option>
        <option value="600">10m</option>
      </select>
    </div>
  );
});

export default AutoRefreshControl; 