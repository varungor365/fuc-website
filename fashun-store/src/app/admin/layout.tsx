import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard - FASHUN.CO',
  description: 'FASHUN.CO Admin Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-900">
      {/* Admin Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-montserrat text-2xl font-bold text-white">
              FASHUN.CO <span className="text-white/60">Admin</span>
            </Link>
            <nav className="flex space-x-6">
              <Link 
                href="/admin" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Overview
              </Link>
              <Link 
                href="/admin/orders" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Orders
              </Link>
              <Link 
                href="/admin/products" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/admin/customers" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Customers
              </Link>
              <Link 
                href="/" 
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back to Store
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

