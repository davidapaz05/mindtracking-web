import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    disableStaticImages: true,
    dangerouslyAllowSVG: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.tsx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
}

export default nextConfig