/**
 * Companion Animals — data-driven categories (Dogs, Cats) and their flagship
 * products, presented as luxury single-product showcases.
 *
 * NOTE: only product names were supplied — short copy below is neutral
 * placeholder; swap in the client's official Vencomax 12 / Ronavac copy later.
 */
export type CompanionProduct = {
  name: string;
  category: string;
  short: string;
  image: string;
  href: string;
};

export type CompanionCategory = {
  id: string;
  name: string;
  subtitle: string;
  product: CompanionProduct;
};

export const COMPANION_CATEGORIES: CompanionCategory[] = [
  {
    id: "dogs",
    name: "Dogs",
    subtitle: "Reliable vaccination solutions for healthier canine lives.",
    product: {
      name: "Vencomax 12",
      category: "Vaccines",
      short:
        "A comprehensive multivalent canine vaccine, engineered with modern veterinary science to build strong, lasting immunity and protect dogs through every life stage.",
      image: "/images/products/companion/WhatsApp-Image-2025-04-24-at-10.32.55-AM.jpeg",
      href: "/contact-us/",
    },
  },
  {
    id: "cats",
    name: "Cats",
    subtitle: "Trusted feline vaccination solutions backed by international veterinary science.",
    product: {
      name: "Ronavac",
      category: "Vaccines",
      short:
        "A trusted feline vaccine backed by international veterinary science — protecting cats with dependable, modern immunity from kittenhood onward.",
      image: "/images/products/companion/WhatsApp-Image-2025-04-24-at-10.33.35-AM.jpeg",
      href: "/contact-us/",
    },
  },
];
