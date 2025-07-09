import { toast } from 'sonner';

export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
  originalError?: Error;
  context?: ErrorContext;
  timestamp: Date;
}

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: ErrorContext;
  timestamp: Date;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    context?: ErrorContext,
    originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date();
    
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorDetails[] = [];
  private maxLogSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Log error details
  private logError(error: ErrorDetails): void {
    this.errorLog.push(error);
    
    // Keep only the most recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', error);
    }

    // TODO: Send to external logging service in production
    // await this.sendToLoggingService(error);
  }

  // Handle different types of errors
  handle(error: unknown, context?: ErrorContext): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new AppError(
        error.message,
        'UNKNOWN_ERROR',
        500,
        context,
        error
      );
    } else if (typeof error === 'string') {
      appError = new AppError(error, 'STRING_ERROR', 500, context);
    } else {
      appError = new AppError(
        'An unexpected error occurred',
        'UNEXPECTED_ERROR',
        500,
        context
      );
    }

    // Log the error
    this.logError({
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      originalError: error instanceof Error ? error : undefined,
      context: appError.context,
      timestamp: appError.timestamp,
    });

    return appError;
  }

  // Handle async operations with error handling
  async handleAsync<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    fallbackValue?: T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const appError = this.handle(error, context);
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw appError;
    }
  }

  // Handle errors with user notification
  handleWithToast(
    error: unknown,
    context?: ErrorContext,
    customMessage?: string
  ): AppError {
    const appError = this.handle(error, context);
    
    // Show user-friendly message
    const userMessage = customMessage || this.getUserFriendlyMessage(appError);
    toast.error(userMessage);
    
    return appError;
  }

  // Get user-friendly error message
  private getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network connection failed. Please check your internet connection.';
      case 'UNAUTHORIZED':
        return 'You are not authorized to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'SERVER_ERROR':
        return 'Server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Get error log for debugging
  getErrorLog(): ErrorDetails[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Handle Supabase errors specifically
  handleSupabaseError(error: any, context?: ErrorContext): AppError {
    let code = 'SUPABASE_ERROR';
    let statusCode = 500;
    let message = error.message || 'Database operation failed';

    // Handle specific Supabase error patterns
    if (error.code === 'PGRST116') {
      code = 'NOT_FOUND';
      statusCode = 404;
      message = 'Resource not found';
    } else if (error.code === '23505') {
      code = 'DUPLICATE_KEY';
      statusCode = 409;
      message = 'This record already exists';
    } else if (error.code === '23503') {
      code = 'FOREIGN_KEY_VIOLATION';
      statusCode = 409;
      message = 'Cannot delete this record because it is referenced by other data';
    } else if (error.code === '42501') {
      code = 'INSUFFICIENT_PRIVILEGE';
      statusCode = 403;
      message = 'You do not have permission to perform this action';
    } else if (error.message?.includes('infinite recursion')) {
      code = 'RLS_RECURSION';
      statusCode = 500;
      message = 'Database security policy error. Please contact support.';
    }

    return this.handle(new AppError(message, code, statusCode, context), context);
  }

  // Handle network errors
  handleNetworkError(error: any, context?: ErrorContext): AppError {
    const message = error.message || 'Network request failed';
    return this.handle(new AppError(message, 'NETWORK_ERROR', 0, context), context);
  }

  // Handle validation errors
  handleValidationError(message: string, context?: ErrorContext): AppError {
    return this.handle(new AppError(message, 'VALIDATION_ERROR', 400, context), context);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error patterns
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R,
  context?: ErrorContext
) => {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      throw errorHandler.handle(error, context);
    }
  };
};

export const withAsyncErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext,
  fallbackValue?: R
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = errorHandler.handle(error, context);
      
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }
      
      throw appError;
    }
  };
};

// Helper for creating error contexts
export const createErrorContext = (
  component: string,
  action: string,
  additionalInfo?: Record<string, any>
): ErrorContext => ({
  component,
  action,
  additionalInfo,
});