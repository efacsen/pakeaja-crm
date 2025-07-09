import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { errorHandler, ErrorContext, AppError } from '@/lib/error-handler';

export function useErrorHandler() {
  const router = useRouter();

  const handleError = useCallback((
    error: unknown,
    context?: ErrorContext,
    customMessage?: string
  ): AppError => {
    const appError = errorHandler.handleWithToast(error, context, customMessage);
    
    // Handle specific error codes
    switch (appError.code) {
      case 'UNAUTHORIZED':
        router.push('/unauthorized');
        break;
      case 'NOT_FOUND':
        // Could redirect to 404 page if needed
        break;
      case 'RLS_RECURSION':
        // Redirect to debug page for database issues
        router.push('/dashboard/debug');
        break;
    }
    
    return appError;
  }, [router]);

  const handleAsyncError = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    fallbackValue?: T,
    customMessage?: string
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      const appError = handleError(error, context, customMessage);
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw appError;
    }
  }, [handleError]);

  const handleSupabaseError = useCallback((
    error: unknown,
    context?: ErrorContext,
    customMessage?: string
  ): AppError => {
    const appError = errorHandler.handleSupabaseError(error, context);
    
    if (customMessage) {
      errorHandler.handleWithToast(appError, context, customMessage);
    } else {
      errorHandler.handleWithToast(appError, context);
    }
    
    return appError;
  }, []);

  const handleNetworkError = useCallback((
    error: unknown,
    context?: ErrorContext,
    customMessage?: string
  ): AppError => {
    const appError = errorHandler.handleNetworkError(error, context);
    errorHandler.handleWithToast(appError, context, customMessage);
    return appError;
  }, []);

  const handleValidationError = useCallback((
    message: string,
    context?: ErrorContext
  ): AppError => {
    const appError = errorHandler.handleValidationError(message, context);
    errorHandler.handleWithToast(appError, context);
    return appError;
  }, []);

  return {
    handleError,
    handleAsyncError,
    handleSupabaseError,
    handleNetworkError,
    handleValidationError,
    getErrorLog: errorHandler.getErrorLog.bind(errorHandler),
    clearErrorLog: errorHandler.clearErrorLog.bind(errorHandler),
  };
}