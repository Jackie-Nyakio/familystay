/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost',
      '3262-38-226-202-130.ngrok-free.app',
      '*.ngrok-free.app',
      'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://margurite-nonvalid-harper.ngrok-free.dev/api',
  },
}

module.exports = nextConfig
