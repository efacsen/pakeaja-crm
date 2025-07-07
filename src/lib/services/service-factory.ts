/**
 * Service Factory
 * Provides a unified interface to switch between mock and Supabase services
 * based on environment configuration
 */

import { canvassingService as mockCanvassingService } from './canvassing-service';
import { mockPipelineService } from './sales/mock-pipeline.service';
import { supabaseCanvassingService } from './supabase-canvassing.service';
import { supabasePipelineService } from './supabase-pipeline.service';
import { customersService as mockCustomersService } from './customers-service';
import { supabaseCustomersService } from './supabase-customers.service';

// Check if we should use Supabase services
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

// Export the appropriate services based on configuration
export const canvassingService = USE_SUPABASE 
  ? supabaseCanvassingService 
  : mockCanvassingService;

export const pipelineService = USE_SUPABASE 
  ? supabasePipelineService 
  : mockPipelineService;

export const customersService = USE_SUPABASE 
  ? supabaseCustomersService 
  : mockCustomersService;

// Export service types for TypeScript
export type CanvassingServiceType = typeof canvassingService;
export type PipelineServiceType = typeof pipelineService;
export type CustomersServiceType = typeof customersService;

// Export service configuration
export const serviceConfig = {
  useSupabase: USE_SUPABASE,
  services: {
    canvassing: USE_SUPABASE ? 'supabase' : 'mock',
    pipeline: USE_SUPABASE ? 'supabase' : 'mock',
    customers: USE_SUPABASE ? 'supabase' : 'mock',
  }
};