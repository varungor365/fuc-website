// MetaMask error handler
// This prevents MetaMask connection errors from breaking the app

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

if (typeof window !== 'undefined') {
  // Handle MetaMask injection errors
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('MetaMask') || 
         event.error.message.includes('ethereum') ||
         event.filename?.includes('chrome-extension'))) {
      console.warn('MetaMask extension error caught and handled:', event.error.message)
      event.preventDefault()
      return false
    }
  })

  // Handle unhandled promise rejections from MetaMask
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && 
        (event.reason.message?.includes('MetaMask') || 
         event.reason.message?.includes('ethereum') ||
         event.reason.toString?.().includes('connect'))) {
      console.warn('MetaMask promise rejection caught and handled:', event.reason)
      event.preventDefault()
    }
  })

  // Prevent MetaMask auto-connection if it exists
  if (window.ethereum && window.ethereum.isMetaMask) {
    // Don't auto-connect, just log that MetaMask is available
    console.log('MetaMask detected but auto-connection disabled')
  }
}

export {}
