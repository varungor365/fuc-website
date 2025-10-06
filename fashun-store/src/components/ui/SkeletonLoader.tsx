export default function SkeletonLoader({ type = 'product' }: { type?: 'product' | 'card' | 'text' }) {
  if (type === 'product') {
    return (
      <div className="space-y-4">
        <div className="skeleton h-64 rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    );
  }

  if (type === 'card') {
    return <div className="skeleton h-48 rounded-lg" />;
  }

  return <div className="skeleton h-4 w-full rounded" />;
}
