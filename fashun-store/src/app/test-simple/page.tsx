import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Test',
  description: 'Test page to debug startup issues'
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">FASHUN.CO Platform</h1>
        <p className="text-lg">🚀 Frontend is running successfully!</p>
        <div className="mt-8 space-y-2">
          <p>✅ Next.js 15.5.4</p>
          <p>✅ React 18</p>
          <p>✅ Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}