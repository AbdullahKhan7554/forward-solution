/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // product and blog images live in the Supabase "media" bucket
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async redirects() {
    return [
      { source: "/companion-animals", destination: "/products", permanent: true },
      { source: "/products/companion-animals", destination: "/products", permanent: true },
      { source: "/blog/core-vaccination-dogs-cats", destination: "/blog", permanent: true },
      { source: "/faq", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/", permanent: true },
      { source: "/terms-of-use", destination: "/", permanent: true },
      { source: "/ruminants/vaccines", destination: "/ruminants", permanent: true },
      { source: "/products/ruminants/vaccines", destination: "/ruminants", permanent: true },
    ];
  },
};

export default nextConfig;
