import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // App metadata
  env: {
    NEXT_PUBLIC_APP_NAME: 'PakeAja CRM',
    NEXT_PUBLIC_COMPANY_NAME: 'PT Pake Aja Teknologi',
  },

  // Experimental features for better CSS handling
  experimental: {
    optimizeCss: true,
  },
  
  // Ensure proper static file handling
  async rewrites() {
    return [];
  },
  
  // Configure webpack for better error handling
  webpack: (config, { isServer }) => {
    // Ignore certain warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration  
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
