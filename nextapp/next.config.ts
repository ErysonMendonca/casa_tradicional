import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Corrige o aviso de workspace root no Next.js 16/Turbopack
  experimental: {
    turbopack: {
      root: './',
    },
  } as any,
};

export default nextConfig;
