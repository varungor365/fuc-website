'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  }

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a MetaMask-related error
    if (error.message.includes('MetaMask') || 
        error.message.includes('ethereum') || 
        error.message.includes('connect') ||
        error.stack?.includes('chrome-extension')) {
      console.warn('MetaMask error caught by ErrorBoundary:', error.message)
      // Don't show error UI for MetaMask errors, just log them
      return { hasError: false, errorMessage: '' }
    }
    
    return { hasError: true, errorMessage: error.message }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log non-MetaMask errors
    if (!error.message.includes('MetaMask') && 
        !error.message.includes('ethereum') &&
        !error.stack?.includes('chrome-extension')) {
      console.error('Uncaught error:', error, errorInfo)
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-300 mb-6">We're sorry for the inconvenience. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
