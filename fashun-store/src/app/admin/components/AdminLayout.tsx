'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-72 transition-all duration-500">
        {/* Top Bar */}
        <TopBar title={title} subtitle={subtitle} />

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout