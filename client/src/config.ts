export const config = {
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  signalingUrl: import.meta.env.VITE_SIGNALING_URL || 'http://localhost:3001',
}

if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_APP_URL) {
    console.warn('VITE_APP_URL is not set in production')
  }
  if (!import.meta.env.VITE_SIGNALING_URL) {
    console.warn('VITE_SIGNALING_URL is not set in production')
  }
}