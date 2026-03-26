/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/ai-prompt-library',
  assetPrefix: '/ai-prompt-library',
  webpack: (config) => {
    // Prevent webpack from bundling Node.js-only ONNX runtime during browser build
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    }
    return config
  },
}
module.exports = nextConfig
