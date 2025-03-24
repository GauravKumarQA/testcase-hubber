
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
