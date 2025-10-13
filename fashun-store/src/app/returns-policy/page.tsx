export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Returns & Exchange Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">30-Day Return Policy</h2>
            <p>We offer a hassle-free 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Contact our support team at support@fashun.co.in</li>
              <li>Provide your order number and reason for return</li>
              <li>Pack the item securely in original packaging</li>
              <li>Ship to our returns address (provided via email)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Conditions</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Items must be unworn and unwashed</li>
              <li>Original tags must be attached</li>
              <li>Original packaging should be intact</li>
              <li>Proof of purchase required</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
