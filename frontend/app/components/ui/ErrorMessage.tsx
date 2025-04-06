interface ErrorMessageProps {
  message: string;
  description?: string;
}

export default function ErrorMessage({ message, description }: ErrorMessageProps) {
  return (
    <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-200 dark:border-red-500/30">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{message}</h3>
          {description && (
            <div className="mt-1 text-xs text-red-700 dark:text-red-300/80">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 