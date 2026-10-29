const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";

// Report-only for now: violations show in the browser console, nothing is blocked.
// Allows Supabase (images, API, realtime), the contact form endpoint and the Google Maps embed;
// wa.me and Maps links are plain navigation, which CSP doesn't restrict.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabase}`,
  "font-src 'self'",
  `connect-src 'self' ${supabase} ${supabase.replace(/^https:/, "wss:")} https://api.web3forms.com`,
  "frame-src https://www.google.com https://maps.google.com",
  "form-action 'self' https://wa.me",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
