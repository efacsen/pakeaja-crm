// Re-export everything from auth-compat for backward compatibility
export * from './auth-compat';

// Also export new RBAC types for gradual migration
export * as RBAC from './rbac';