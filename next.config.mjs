/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  webpack: (config) => {
    // Evita que la caché de webpack consuma cientos de MB en disco
    config.cache = false;
    return config;
  },
};

export default nextConfig;
