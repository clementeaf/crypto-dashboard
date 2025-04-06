import { memo } from 'react';
import { ButtonVariant, LoadingButtonProps } from '~/types/types';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-cyan-500 hover:bg-cyan-600 text-white'
};

const sizeStyles = {
  sm: 'text-sm px-2 py-1',
  md: 'px-3 py-1.5',
  lg: 'text-lg px-4 py-2'
};

const LoadingButton = memo(function LoadingButton({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
  loadingText,
  icon
}: LoadingButtonProps) {
  const baseStyle = 'rounded flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const disabledStyle = 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed';
  
  const buttonStyle = `
    ${baseStyle}
    ${!disabled && !isLoading ? variantStyles[variant] : disabledStyle}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type !== 'submit' && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={onClick ? handleClick : undefined}
      disabled={disabled || isLoading}
      className={buttonStyle}
      aria-busy={isLoading}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {isLoading && loadingText ? loadingText : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

export default LoadingButton; 