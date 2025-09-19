/** @type {import('next').NextConfig} */
// Root Next.js config - points to the actual config in fashun-store
const path = require('path');

module.exports = {
  // This is a pointer config for Vercel detection
  // The actual Next.js app is in ./fashun-store/
  experimental: {
    externalDir: true,
  },
};