/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['fakestoreapi.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include mysql2 on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        mysql2: false,
        dns: false,
      };
    }
    return config;
  },
}

export default nextConfig; 