/**
 * Service Factory
 * Provides a unified interface to switch between mock and Supabase services
 * based on environment configuration
 */

import { mockCanvassingService } from './canvassing-service';
import { mockPipelineService } from './sales/mock-pipeline.service';
import { supabaseCanvassingService } from './supabase-canvassing.service';
import { supabasePipelineService } from './supabase-pipeline.service';

// Check if we should use Supabase services
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

// Export the appropriate services based on configuration
export const canvassingService = USE_SUPABASE 
  ? supabaseCanvassingService 
  : mockCanvassingService;

export const pipelineService = USE_SUPABASE 
  ? supabasePipelineService 
  : mockPipelineService;

// Helper to check which mode we're in
export const isUsingSupabase = () => USE_SUPABASE;

// Export service types for consistency
export type CanvassingService = typeof canvassingService;
export type PipelineService = typeof pipelineService;