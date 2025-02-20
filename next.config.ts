import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
        allowedOrigins: ['localhost:3000'],
        bodySizeLimit: '2mb',
    },
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