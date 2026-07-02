import type { MetadataRoute } from "next";

const SITE = "https://agriprompakistan.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
