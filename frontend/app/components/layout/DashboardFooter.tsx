interface DashboardFooterProps {
  lastUpdated: string | null;
}

export default function DashboardFooter({ lastUpdated }: DashboardFooterProps) {
  return (
    <footer className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-6 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          <p>Crypto Dashboard — Drag the cards to reorganize them</p>
          <p className="mt-1">Last update: {lastUpdated || 'N/A'}</p>
        </div>
      </div>
    </footer>
  );
} 