
import { CSSProperties } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'purple' | 'white';
  center?: boolean;
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default', 
  center = false, 
  className = '',
  text
}: LoadingSpinnerProps) => {
  
  // Size mapping
  const sizeMapping = {
    sm: {
      spinner: 'w-6 h-6',
      container: 'py-2',
      text: 'text-xs'
    },
    md: {
      spinner: 'w-10 h-10',
      container: 'py-4',
      text: 'text-sm'
    },
    lg: {
      spinner: 'w-16 h-16',
      container: 'py-6',
      text: 'text-base'
    }
  };

  // Color variant mapping
  const variantMapping = {
    default: 'border-t-aura-purple border-white/20',
    purple: 'border-t-aura-accent border-aura-purple/30',
    white: 'border-t-white border-white/30'
  };

  // Apply smooth 60fps animation using CSS
  const spinnerStyle: CSSProperties = {
    animation: 'spinner-rotate 1s cubic-bezier(0.83, 0, 0.17, 1) infinite',
  };

  return (
    <div className={`
      flex flex-col items-center justify-center
      ${center ? 'absolute inset-0' : ''}
      ${sizeMapping[size].container}
      ${className}
    `}>
      <div
        className={`
          rounded-full
          border-4
          ${sizeMapping[size].spinner}
          ${variantMapping[variant]}
        `}
        style={spinnerStyle}
        role="status"
        aria-label="Loading"
      />
      
      {text && (
        <p className={`mt-3 text-white/70 ${sizeMapping[size].text}`}>{text}</p>
      )}

      <style>
        {`
          @keyframes spinner-rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
