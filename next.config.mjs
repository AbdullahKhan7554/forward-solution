/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async redirects() {
    return [
      { source: "/companion-animals", destination: "/products", permanent: true },
      { source: "/products/companion-animals", destination: "/products", permanent: true },
      { source: "/blog/core-vaccination-dogs-cats", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
