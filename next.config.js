/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cloudinary.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
