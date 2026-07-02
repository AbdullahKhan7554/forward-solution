export type FaqItem = { q: string; a: string };

export type FaqCategory = {
  id: string; // anchor id for quick-nav smooth scroll
  slate: string; // film-slate label (e.g. "The Products")
  eyebrow: string;
  heading: string;
  items: FaqItem[];
};

/**
 * FAQ content — categories mirror the page's Sections 03–07. Answers are
 * science-led and on-brand; edit here and both the accordions and quick-nav
 * stay in sync.
 */
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "faq-products",
    slate: "The Products",
    eyebrow: "Products",
    heading: "Our Products",
    items: [
      {
        q: "What products does Agriprom Pakistan offer?",
        a: "A science-led portfolio spanning feed additives, enzymes, organic acids, toxin binders, organic minerals, veterinary pharmaceuticals and vaccines — engineered to improve animal health, nutrition and productivity.",
      },
      {
        q: "Which animal categories do you serve?",
        a: "Poultry, ruminants (dairy and beef cattle) and companion animals, each with dedicated ranges tailored to their nutritional and health needs.",
      },
      {
        q: "Are your products internationally certified?",
        a: "Yes. Our products are sourced from globally-qualified manufacturers and held to rigorous international quality, safety and efficacy standards.",
      },
      {
        q: "How do I choose the right product?",
        a: "Share your species, production stage and challenge with our technical team and we'll recommend the precise solution — or start from the relevant category on our Products page.",
      },
      {
        q: "Where can I purchase Agriprom products?",
        a: "Through our nationwide distributor network across Pakistan. Contact us and we'll connect you with your nearest authorised distributor.",
      },
      {
        q: "Do you provide technical product guidance?",
        a: "Absolutely. Our veterinary and technical specialists provide dosage, application and programme guidance to get the most from every product.",
      },
    ],
  },
  {
    id: "faq-animal-health",
    slate: "Animal Health",
    eyebrow: "Animal Health",
    heading: "Animal Health & Nutrition",
    items: [
      {
        q: "Why is animal nutrition important?",
        a: "Nutrition is the foundation of animal health, performance and profitability — the right balance of energy, protein, minerals and functional additives keeps animals productive and resilient.",
      },
      {
        q: "How do feed additives improve livestock performance?",
        a: "They unlock trapped nutrients, support gut health, control pathogens and improve feed conversion — so animals perform better on the same feed.",
      },
      {
        q: "Do your solutions support poultry farms?",
        a: "Yes — poultry is a core focus, with enzymes, organic acids, toxin binders, emulsifiers and gut-health solutions for every stage of production.",
      },
      {
        q: "Do you provide products for dairy cattle?",
        a: "Yes. Our ruminant range includes rumen-protected amino acids, chelated minerals, toxin binders and vaccines to support milk yield, fertility and herd health.",
      },
      {
        q: "Do you offer companion animal solutions?",
        a: "Yes — we provide vaccines and healthcare solutions for dogs and cats, backed by modern veterinary science.",
      },
    ],
  },
  {
    id: "faq-orders",
    slate: "Orders & Supply",
    eyebrow: "Orders & Distribution",
    heading: "Orders & Distribution",
    items: [
      {
        q: "How can I become a distributor?",
        a: "We welcome distributor partners across Pakistan. Send us your details and our commercial team will guide you through the process and portfolio.",
      },
      {
        q: "Can I place bulk orders?",
        a: "Yes. We support commercial-scale and bulk orders — contact us for volume pricing and logistics.",
      },
      {
        q: "Do you supply products nationwide?",
        a: "Yes. From our Lahore base we supply veterinarians, producers and distributors across every province of Pakistan.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on the product, quantity and location; our team confirms a clear timeline with every order.",
      },
      {
        q: "How do I request a quotation?",
        a: "Tell us the products and quantities you need through our contact form or by phone, and we'll send a detailed quotation promptly.",
      },
    ],
  },
  {
    id: "faq-partnerships",
    slate: "Partnerships",
    eyebrow: "Partnerships",
    heading: "Partnerships & Quality",
    items: [
      {
        q: "Which international companies do you partner with?",
        a: "We partner with leading global animal-health innovators including Evonik, CJ Bio, Perstorp, Vegamax, Wellbe, Better Pharma, Dechra, Elanco and Solinko.",
      },
      {
        q: "Do you welcome new business collaborations?",
        a: "Yes — we're always open to partnerships that bring proven science and quality to Pakistan's animal-health market.",
      },
      {
        q: "How does Agriprom ensure product quality?",
        a: "Every product is sourced from globally-qualified manufacturers and validated against rigorous quality, safety and efficacy standards before it reaches your farm.",
      },
      {
        q: "Can international companies contact Agriprom?",
        a: "Absolutely. International manufacturers and partners can reach our team directly through our contact page.",
      },
    ],
  },
  {
    id: "faq-support",
    slate: "Technical Support",
    eyebrow: "Technical Support",
    heading: "Technical Support",
    items: [
      {
        q: "Do you provide veterinary consultation?",
        a: "Yes. Our veterinary specialists offer consultation on health, prevention and treatment decisions.",
      },
      {
        q: "Can your experts visit farms?",
        a: "Where needed, our technical team provides on-farm support to assess challenges and tailor the right solutions.",
      },
      {
        q: "How do I contact technical support?",
        a: "Reach us by phone, email or the contact form — our team is available around the clock.",
      },
      {
        q: "Can I receive product recommendations?",
        a: "Yes — share your species and challenge and we'll match the right products and programme to your needs.",
      },
    ],
  },
];
