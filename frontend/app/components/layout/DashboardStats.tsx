import SearchFilter from '~/components/ui/SearchFilter';
import AutoRefreshControl from '~/components/ui/AutoRefreshControl';

interface DashboardStatsProps {
  username: string;
  totalCoins: number;
  filteredCoins: number;
  autoRefresh: boolean;
  refreshInterval: number;
  isLoading: boolean;
  lastUpdated: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleAutoRefresh: () => void;
  onChangeRefreshInterval: (interval: number) => void;
}

export default function DashboardStats({
  username,
  totalCoins,
  filteredCoins,
  autoRefresh,
  refreshInterval,
  isLoading,
  lastUpdated,
  searchTerm,
  onSearchChange,
  onToggleAutoRefresh,
  onChangeRefreshInterval,
}: DashboardStatsProps) {
  return (
    <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to Dashboard</h2>
              <div className="ml-3 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {username}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </div>
                ) : lastUpdated ? (
                  <span>Updated: {lastUpdated}</span>
                ) : null}
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <AutoRefreshControl
                  autoRefresh={autoRefresh}
                  refreshInterval={refreshInterval}
                  onToggleAutoRefresh={onToggleAutoRefresh}
                  onChangeInterval={onChangeRefreshInterval}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              View and analyze the main cryptocurrencies in real time
            </p>
            
            {/* Flexible stats */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Coins</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{totalCoins}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Monitored</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{filteredCoins}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Auto-refresh</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{autoRefresh ? 'Enabled' : 'Disabled'}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Interval</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{refreshInterval}s</div>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-1/3 xl:w-1/4 mt-3 md:mt-0">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50 shadow-inner">
              <SearchFilter 
                searchTerm={searchTerm}
                setSearchTerm={onSearchChange}
                isLoading={isLoading}
                placeholder="Search cryptocurrency..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 