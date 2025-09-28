/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Load environment variables with fallback
    const apiUrl = process.env.API_URL || 'https://stellar-app-production.up.railway.app';
    
    console.log('API_URL in rewrites:', apiUrl); // Debug log
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;