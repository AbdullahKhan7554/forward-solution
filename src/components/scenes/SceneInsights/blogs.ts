export type BlogPost = {
  title: string;
  category: string;
  date: string;
  readingTime: string;
  excerpt: string;
  href: string;
  image?: string;
};

/**
 * Data-driven blog list (latest 3). Titles/dates are the client's existing
 * posts. Swap `image` with real featured art when available.
 */
export const blogPosts: BlogPost[] = [
  {
    title: "Mycotoxins in Poultry Feed: Effects, Prevention & Effective Binders",
    category: "Poultry Health",
    date: "May 25, 2025",
    readingTime: "6 min read",
    excerpt:
      "How mycotoxins undermine flock performance — and the binders that keep feed safe.",
    href: "/blog/mycotoxins-in-poultry-feed",
    image: "/1.jpg",
  },
  {
    title:
      "ProPhorce SR130: Advanced Tributyrin Solution for Poultry Gut Health and Performance",
    category: "Gut Health",
    date: "May 25, 2025",
    readingTime: "5 min read",
    excerpt:
      "Why esterified butyric acid supports gut integrity and long-term bird performance.",
    href: "/blog/prophorce-sr130-tributyrin-gut-health",
    image: "/2.jpg",
  },
  {
    title: "How NSP Enzymes in Poultry Feed Improve Growth and Feed Efficiency",
    category: "Nutrition",
    date: "May 25, 2025",
    readingTime: "5 min read",
    excerpt:
      "How NSP enzymes unlock trapped nutrients and raise feed efficiency in poultry.",
    href: "/blog/nsp-enzymes-poultry-feed-efficiency",
    image: "/3.jpg",
  },
];
