# Error Handling System

This document describes the comprehensive error handling system implemented in the PakeAja CRM application.

## Features

### 1. Centralized Error Handling
- **ErrorHandler Class**: Singleton class that manages all error handling
- **Error Logging**: Maintains a log of errors for debugging
- **Error Classification**: Categorizes errors by type and severity

### 2. Error Types
- **AppError**: Custom error class with additional context
- **Supabase Errors**: Specific handling for database errors
- **Network Errors**: Handling for network-related failures
- **Validation Errors**: Input validation error handling

### 3. User-Friendly Messages
- Converts technical errors into user-friendly messages
- Automatic toast notifications for user feedback
- Context-aware error messages

### 4. React Integration
- **useErrorHandler Hook**: Easy-to-use React hook for error handling
- **Error Boundaries**: Catch React component errors
- **Async Error Handling**: Wrapper for async operations

## Usage

### Basic Error Handling

```typescript
import { useErrorHandler } from '@/hooks/use-error-handler';

function MyComponent() {
  const { handleError, handleAsyncError } = useErrorHandler();

  const handleSubmit = async (data) => {
    await handleAsyncError(
      async () => {
        // Your async operation
        await someAsyncOperation(data);
      },
      {
        component: 'MyComponent',
        action: 'handleSubmit',
        additionalInfo: { data }
      },
      null, // fallback value (optional)
      'Failed to submit form' // custom message (optional)
    );
  };

  return (
    // Your component JSX
  );
}
```

### Supabase Error Handling

```typescript
import { useErrorHandler } from '@/hooks/use-error-handler';

function DatabaseComponent() {
  const { handleSupabaseError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('table').select('*');
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error, {
        component: 'DatabaseComponent',
        action: 'fetchData'
      });
    }
  };
}
```

### Error Context

Provide context for better error tracking:

```typescript
const context = {
  component: 'ComponentName',
  action: 'actionName',
  userId: user?.id,
  additionalInfo: {
    // Any relevant data
  }
};

handleError(error, context, 'Custom error message');
```

## Error Boundaries

The application uses React Error Boundaries to catch component errors:

```typescript
// Already implemented in:
// - Root layout: /src/app/layout.tsx
// - Dashboard layout: /src/app/dashboard/layout.tsx
```

## Error Logging

All errors are logged with:
- Error message and stack trace
- Context information
- Timestamp
- User information (if available)

Access error logs:

```typescript
const { getErrorLog, clearErrorLog } = useErrorHandler();

// Get all logged errors
const errors = getErrorLog();

// Clear error log
clearErrorLog();
```

## Error Types and Codes

### Common Error Codes
- `NETWORK_ERROR`: Network connection issues
- `UNAUTHORIZED`: Authentication/authorization failures
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failures
- `SERVER_ERROR`: Server-side errors
- `SUPABASE_ERROR`: Database operation failures
- `RLS_RECURSION`: Database security policy errors

### Supabase-Specific Codes
- `DUPLICATE_KEY`: Unique constraint violations
- `FOREIGN_KEY_VIOLATION`: Reference constraint violations
- `INSUFFICIENT_PRIVILEGE`: Permission denied

## Best Practices

1. **Always use error handling** for async operations
2. **Provide context** for better debugging
3. **Use custom messages** for user-facing operations
4. **Handle specific error types** appropriately
5. **Log errors** for debugging and monitoring

## Example Implementation

See `/src/components/features/materials/MaterialsPage.tsx` for a complete example of how to integrate the error handling system into a React component.

## Future Enhancements

- External logging service integration
- Error analytics and reporting
- Automatic error recovery mechanisms
- Error rate limiting and throttling