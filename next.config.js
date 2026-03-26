/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/ai-prompt-library',
  assetPrefix: '/ai-prompt-library',
}
module.exports = nextConfig
