/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Suppress middleware deprecation warning for Next.js 16
  experimental: {
    suppressMiddlewareDeprecationWarning: true,
  },
}

export default nextConfig