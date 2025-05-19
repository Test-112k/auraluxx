
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  type?: 'card' | 'banner' | 'text' | 'circle';
  className?: string;
  width?: string;
  height?: string;
}

const LoadingSkeleton = ({ 
  type = 'card', 
  className, 
  width, 
  height 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-white/5 rounded-lg";

  const skeletonStyles = {
    card: "aspect-[2/3]",
    banner: "aspect-video",
    text: "h-4",
    circle: "rounded-full aspect-square"
  };

  return (
    <div 
      className={cn(
        baseClasses, 
        skeletonStyles[type],
        className
      )}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto' 
      }}
    />
  );
};

export default LoadingSkeleton;
