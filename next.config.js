/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In production the browser calls /api on this site and Next forwards it to
  // the API service, so the login cookie stays on one domain.
  async rewrites() {
    if (!process.env.API_URL) return [];
    return [{ source: "/api/:path*", destination: `${process.env.API_URL}/api/:path*` }];
  },
};

module.exports = nextConfig
