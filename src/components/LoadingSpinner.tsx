interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} border-2 border-[var(--card-border)] border-t-[var(--accent-cyan)] rounded-full animate-spin`}
      />
      {label && <p className="text-xs text-gray-400">{label}</p>}
    </div>
  );
}
