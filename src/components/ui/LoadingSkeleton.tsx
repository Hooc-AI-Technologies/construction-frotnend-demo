interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'row' | 'text';
}

export function LoadingSkeleton({ count = 6, type = 'card' }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="shimmer h-40 rounded-lg" />
            <div className="shimmer h-4 rounded w-3/4" />
            <div className="shimmer h-3 rounded w-1/2" />
            <div className="shimmer h-3 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="shimmer h-8 rounded flex-1" />
              <div className="shimmer h-8 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'row') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-4 flex gap-4">
            <div className="shimmer w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 rounded w-1/2" />
              <div className="shimmer h-3 rounded w-3/4" />
              <div className="shimmer h-3 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shimmer h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  );
}
