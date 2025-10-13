export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-500 mb-4"></div>
        <h2 className="text-2xl font-brand text-white mb-2">FASHUN.CO</h2>
        <p className="text-accent-400 font-medium">Loading your experience...</p>
      </div>
    </div>
  );
}
