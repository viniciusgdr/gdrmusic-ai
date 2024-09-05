const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})


/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
  images: {
    domains: ['i.ytimg.com', 'lh3.googleusercontent.com', 'i1.sndcdn.com'],
    unoptimized: true
  }
});

module.exports = nextConfig