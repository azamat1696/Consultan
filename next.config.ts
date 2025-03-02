import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
        allowedOrigins: ['localhost:3000', 'http://localhost:3000','dancomy.com','https://dancomy.com'],
        bodySizeLimit: '8mb',
    },
},
images: {
  unoptimized: true,
  remotePatterns: [
    {
      hostname: 'localhost',
      protocol: 'http',
      port: '3000',
    },
    {
      hostname: 'dancomy.com',
      protocol: 'https',
      port: '',
    },
    {
      hostname: 'dancomy.com',
      protocol: 'https',
      port: '',
    },
  ],
},


webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };
    }
    return config;
}
};

export default nextConfig;