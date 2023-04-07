/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@accountjs/contracts', '@accountjs/sdk'],
}

module.exports = nextConfig
