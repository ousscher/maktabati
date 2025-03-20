/** @type {import('next').NextConfig} */

import i18n from "./i18n.config.mjs";

const nextConfig = {
  i18n: i18n,
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  webpack: (config) => {
    config.externals.push({
      '@google-cloud/firestore': 'commonjs @google-cloud/firestore'
    });
    
    // Ajoutez cette partie si vous avez besoin de polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };

    return config;
  }
};

export default nextConfig;
