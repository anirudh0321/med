
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '6000-firebase-studio-1748787162267.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
