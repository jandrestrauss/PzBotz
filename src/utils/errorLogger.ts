import { ErrorInfo } from 'react';

export function logError(error: Error, errorInfo: ErrorInfo) {
  // Log to console for development
  console.error('Error occurred:', error);
  console.error('Error info:', errorInfo);

  // Implement your error logging service here
  // Example: Send to a logging service
  sendToLoggingService({
    error: error.toString(),
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString()
  });
}

async function sendToLoggingService(errorData: any) {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    });
  } catch (e) {
    console.error('Failed to send error to logging service:', e);
  }
}
