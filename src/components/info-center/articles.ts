import type { BlogPost } from "@/components/scenes/SceneInsights/blogs";

/**
 * INFO CENTER — the knowledge library data source.
 *
 * A single source of truth for both the listing grid and the article pages.
 * `Article` is a structural superset of `BlogPost`, so the existing BlogCard
 * renders these unchanged. Titles/dates/categories mirror the client's real
 * posts (content-freeze); the section bodies are science-toned editorial copy
 * ready to be swapped for the client's verbatim text.
 */

export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

/** Broad filter groups surfaced as pills on the listing page. */
export type FilterCategory =
  | "Poultry"
  | "Ruminants"
  | "Companion Animals"
  | "Veterinary"
  | "Nutrition"
  | "Industry News";

/** Ordered filter set for the BlogFilters pills ("All" first). */
export const ARTICLE_FILTERS = [
  "All",
  "Poultry",
  "Ruminants",
  "Companion Animals",
  "Veterinary",
  "Nutrition",
  "Industry News",
] as const;

export type Article = BlogPost & {
  slug: string;
  filter: FilterCategory;
  author: string;
  intro: string;
  sections: ArticleSection[];
  takeaways: string[];
};

export const articles: Article[] = [
  {
    slug: "mycotoxins-in-poultry-feed",
    title: "Mycotoxins in Poultry Feed: Effects, Prevention & Effective Binders",
    category: "Poultry Health",
    filter: "Poultry",
    date: "May 25, 2025",
    readingTime: "6 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "How mycotoxins undermine flock performance — and the binders that keep feed safe.",
    href: "/blog/mycotoxins-in-poultry-feed",
    image: "/1.jpg",
    intro:
      "Mycotoxins are among the most persistent and costly threats in modern poultry production. Produced by moulds that colonise grain in the field and in storage, they silently erode performance long before clinical signs appear. Understanding how they act — and how to neutralise them — is central to protecting flock health and margin.",
    sections: [
      {
        heading: "What mycotoxins do to the bird",
        paragraphs: [
          "Mycotoxins are secondary metabolites of fungi such as Aspergillus, Fusarium and Penicillium. Even at concentrations invisible to the eye, they compromise the intestinal lining, suppress immune response and burden the liver — the organ tasked with detoxifying them.",
          "The result is a cascade of subclinical losses: poorer feed conversion, uneven flock uniformity, reduced weight gain and heightened susceptibility to secondary disease. Because the damage is gradual, it is frequently mistaken for a management or nutrition problem.",
        ],
      },
      {
        heading: "Why prevention starts before the feed mill",
        paragraphs: [
          "Contamination begins in the field and accelerates wherever moisture, temperature and time allow moulds to grow. Sound storage discipline — controlled humidity, clean silos and rapid throughput — remains the first line of defence.",
          "Yet field prevention alone cannot guarantee a clean ration. Grain quality varies batch to batch, and multiple mycotoxins commonly occur together. A dependable in-feed strategy is therefore essential, not optional.",
        ],
      },
      {
        heading: "How effective binders work",
        paragraphs: [
          "A modern toxin binder adsorbs mycotoxins in the gut, forming a stable complex that passes through the bird without being absorbed. The best binders combine a broad adsorptive surface with selectivity — capturing harmful toxins while sparing vitamins and trace minerals.",
          "Broad-spectrum solutions extend protection to the more polar mycotoxins that simple clays miss, pairing mineral adsorbents with biological components that target the toxins conventional binders leave behind.",
        ],
      },
    ],
    takeaways: [
      "Mycotoxins cause subclinical losses long before visible symptoms.",
      "Storage hygiene reduces — but cannot eliminate — contamination risk.",
      "A broad-spectrum binder is the reliable safeguard for consistent flock performance.",
    ],
  },
  {
    slug: "prophorce-sr130-tributyrin-gut-health",
    title:
      "ProPhorce SR130: Advanced Tributyrin Solution for Poultry Gut Health and Performance",
    category: "Gut Health",
    filter: "Poultry",
    date: "May 25, 2025",
    readingTime: "5 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "Why esterified butyric acid supports gut integrity and long-term bird performance.",
    href: "/blog/prophorce-sr130-tributyrin-gut-health",
    image: "/2.jpg",
    intro:
      "Butyric acid is the preferred energy source of the cells that line the intestine. Delivering it intact to where it is needed, however, is a formulation challenge. ProPhorce SR130 answers that challenge through an esterified tributyrin technology built for precise, sustained release.",
    sections: [
      {
        heading: "The role of butyric acid in the gut",
        paragraphs: [
          "The enterocytes of the intestinal wall depend on butyrate as their primary fuel. A well-supplied gut lining is a stronger barrier, better able to absorb nutrients and resist the pathogens that undermine performance.",
          "Free butyric acid, however, is largely absorbed high in the digestive tract and carries a strong odour that complicates handling. Much of its benefit is lost before it reaches the lower intestine where it matters most.",
        ],
      },
      {
        heading: "Why esterified tributyrin is different",
        paragraphs: [
          "ProPhorce SR130 binds three butyric acid molecules to a glycerol backbone. This ester is stable through the upper tract and is cleaved gradually by intestinal lipases, releasing butyrate steadily along the full length of the gut.",
          "The outcome is targeted delivery without the odour and handling problems of free acids — more of the active reaching the tissue that uses it, at a consistent rate.",
        ],
      },
      {
        heading: "What it means for performance",
        paragraphs: [
          "A reinforced intestinal barrier translates into measurable gains: improved feed conversion, stronger nutrient uptake and greater resilience under challenge. Because the effect is structural rather than merely reactive, benefits compound across the production cycle.",
          "For producers seeking a science-led alternative to routine antibiotic support, sustained-release tributyrin is a proven cornerstone of a modern gut-health programme.",
        ],
      },
    ],
    takeaways: [
      "Butyrate is the main energy source for intestinal lining cells.",
      "Esterified tributyrin delivers it intact to the lower gut.",
      "Sustained release supports feed efficiency and gut resilience.",
    ],
  },
  {
    slug: "nsp-enzymes-poultry-feed-efficiency",
    title: "How NSP Enzymes in Poultry Feed Improve Growth and Feed Efficiency",
    category: "Nutrition",
    filter: "Nutrition",
    date: "May 25, 2025",
    readingTime: "5 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "How NSP enzymes unlock trapped nutrients and raise feed efficiency in poultry.",
    href: "/blog/nsp-enzymes-poultry-feed-efficiency",
    image: "/3.jpg",
    intro:
      "Cereal grains carry more nutrition than birds can naturally access. Non-starch polysaccharides (NSPs) lock away energy and protein and thicken the gut environment. Targeted enzymes release that hidden value — turning the same ration into better growth.",
    sections: [
      {
        heading: "The anti-nutritional cost of NSPs",
        paragraphs: [
          "NSPs such as arabinoxylans and beta-glucans form the structural fibre of wheat, barley and other cereals. Poultry lack the native enzymes to break them down, so a portion of every ration passes through undigested.",
          "Beyond the lost nutrients, soluble NSPs raise the viscosity of the gut contents. Thicker digesta slows the movement of nutrients to the intestinal wall and creates conditions that favour undesirable microbes.",
        ],
      },
      {
        heading: "How the enzymes unlock value",
        paragraphs: [
          "NSP enzymes — xylanases, glucanases and related activities — cleave these fibres into smaller fragments. This dismantles the cell-wall cages that trap starch and protein, and lowers digesta viscosity so nutrients reach the absorptive surface freely.",
          "The released sugars also serve as a substrate for beneficial gut bacteria, reinforcing a healthier microbial balance alongside the direct nutritional gain.",
        ],
      },
      {
        heading: "The bottom-line effect",
        paragraphs: [
          "By recovering energy and protein that would otherwise be excreted, NSP enzymes improve feed conversion and support more uniform growth. They also give the nutritionist room to formulate more flexibly across variable raw materials.",
          "In a market where feed is the dominant cost, unlocking the nutrition already present in the ration is among the most reliable levers a producer has.",
        ],
      },
    ],
    takeaways: [
      "NSPs trap energy and protein and thicken gut contents.",
      "Xylanases and glucanases release nutrients and cut viscosity.",
      "The result is better feed conversion and steadier growth.",
    ],
  },
  {
    slug: "bypass-protein-dairy-milk-yield",
    title: "Bypass Protein in Dairy Cattle: The Key to Higher Milk Yield",
    category: "Dairy Nutrition",
    filter: "Ruminants",
    date: "May 18, 2025",
    readingTime: "6 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "Why rumen-protected protein reaches the cow's intestine intact — and lifts production.",
    href: "/blog/bypass-protein-dairy-milk-yield",
    image: "/4.jpg",
    intro:
      "In the high-yielding dairy cow, the rumen is both an asset and a bottleneck. Much of the protein a cow eats is degraded by rumen microbes before it can be used for milk. Bypass — or rumen-protected — protein is formulated to survive that first chamber and deliver amino acids where they are absorbed.",
    sections: [
      {
        heading: "The limit of rumen-degradable protein",
        paragraphs: [
          "Rumen microbes break down a large share of dietary protein into ammonia, using only part of it to build microbial protein. For a cow producing thirty or more litres a day, microbial protein alone cannot meet demand.",
          "The shortfall shows up as a plateau in milk yield and, often, poorer reproductive performance — the cow mobilising body reserves to fill the gap.",
        ],
      },
      {
        heading: "How bypass protein closes the gap",
        paragraphs: [
          "Rumen-protected sources resist microbial breakdown and pass through to the small intestine, where their amino acids are absorbed directly. This raises the supply of metabolisable protein without overloading the rumen.",
          "Balancing the profile of these amino acids — particularly methionine and lysine — lets the nutritionist target milk protein and yield precisely, rather than simply feeding more crude protein.",
        ],
      },
      {
        heading: "The production payoff",
        paragraphs: [
          "Correctly formulated bypass protein supports higher and more persistent milk yield, better milk-protein percentage and improved feed efficiency — more output from the same intake.",
          "It also reduces nitrogen excretion, aligning productivity with the environmental expectations now shaping modern dairy.",
        ],
      },
    ],
    takeaways: [
      "Rumen microbes degrade much of a cow's dietary protein.",
      "Bypass protein reaches the intestine intact for direct absorption.",
      "The result is higher, more persistent milk yield and better efficiency.",
    ],
  },
  {
    slug: "managing-sara-high-yielding-herds",
    title: "Managing Sub-Acute Ruminal Acidosis in High-Yielding Herds",
    category: "Herd Health",
    filter: "Ruminants",
    date: "May 11, 2025",
    readingTime: "5 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "The silent condition that quietly erodes rumen health, intake and margin.",
    href: "/blog/managing-sara-high-yielding-herds",
    image: "/5.jpg",
    intro:
      "Sub-acute ruminal acidosis (SARA) is one of the most under-diagnosed conditions in intensive dairy and beef systems. It rarely causes obvious illness, yet it steadily undermines rumen function, intake and profitability across the herd.",
    sections: [
      {
        heading: "What drives SARA",
        paragraphs: [
          "Rations rich in rapidly fermentable carbohydrate — needed to fuel high yields — can push rumen pH below the healthy range for hours each day. Fibre that is too finely chopped, or sorting at the feed bunk, makes it worse.",
          "The low-pH environment damages the rumen wall and disturbs the microbial population that a cow depends on to digest her feed.",
        ],
      },
      {
        heading: "The signs to watch",
        paragraphs: [
          "SARA is defined by its subtlety: fluctuating intake, loose manure, reduced milk-fat percentage and a rise in lameness and displaced abomasum some weeks later.",
          "Because no single cow looks acutely sick, the cost is best read at herd level — in the gap between expected and actual performance.",
        ],
      },
      {
        heading: "A prevention-first strategy",
        paragraphs: [
          "Consistent ration formulation, adequate effective fibre and careful transition-cow management form the foundation. Buffers and rumen modifiers help stabilise pH through the day.",
          "The goal is a steady rumen environment — the single most important asset a high-yielding ruminant has.",
        ],
      },
    ],
    takeaways: [
      "SARA rarely looks like illness but erodes performance herd-wide.",
      "Fermentable carbohydrate and low effective fibre are the main drivers.",
      "Stable rumen pH — through ration and buffers — is the best defence.",
    ],
  },
  {
    slug: "core-vaccination-dogs-cats",
    title: "Core Vaccination Schedules for Dogs and Cats: A Practical Guide",
    category: "Preventive Care",
    filter: "Companion Animals",
    date: "May 6, 2025",
    readingTime: "5 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "The vaccines every companion animal needs — and why timing decides protection.",
    href: "/blog/core-vaccination-dogs-cats",
    image: "/6.png",
    intro:
      "Vaccination remains the most effective, most economical protection a pet owner can give a dog or cat. Understanding which vaccines are essential — and when they should be given — is the difference between reliable immunity and a dangerous gap.",
    sections: [
      {
        heading: "Core versus non-core",
        paragraphs: [
          "Core vaccines protect against diseases that are widespread, severe and often fatal — distemper, parvovirus and rabies in dogs; panleukopenia and feline herpes and calicivirus in cats. These are recommended for every animal.",
          "Non-core vaccines are chosen according to lifestyle and local risk, guided by a veterinarian who knows the animal and its environment.",
        ],
      },
      {
        heading: "Why timing matters",
        paragraphs: [
          "Puppies and kittens are shielded early by maternal antibodies, which also block a vaccine from taking hold. A structured series through the first months bridges the window as that maternal cover fades.",
          "Skipping or delaying a dose can leave an animal unprotected at exactly the age it is most vulnerable.",
        ],
      },
      {
        heading: "Lifelong protection",
        paragraphs: [
          "After the initial course, boosters maintain immunity across the animal's life, with intervals set by vaccine type and veterinary guidance.",
          "A documented, consistent schedule — not one-off catch-ups — is what keeps companion animals genuinely protected.",
        ],
      },
    ],
    takeaways: [
      "Core vaccines guard against the most severe, common diseases.",
      "Early-life timing works around fading maternal antibodies.",
      "Consistent boosters sustain protection for life.",
    ],
  },
  {
    slug: "farm-biosecurity-disease-prevention",
    title: "Farm Biosecurity: Building an Effective Disease-Prevention Programme",
    category: "Biosecurity",
    filter: "Veterinary",
    date: "April 29, 2025",
    readingTime: "6 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "The structured, everyday practices that keep disease off the farm — before it costs you.",
    href: "/blog/farm-biosecurity-disease-prevention",
    image: "/1.jpg",
    intro:
      "Biosecurity is the most cost-effective animal health measure available, yet it is often the first to slip under production pressure. A disciplined programme keeps pathogens out, contains those already present and protects the investment in every animal on the farm.",
    sections: [
      {
        heading: "Keeping disease out",
        paragraphs: [
          "External biosecurity governs everything that crosses the farm boundary: incoming animals, vehicles, equipment, feed and people. Controlled entry, quarantine of new stock and disciplined visitor protocols close the commonest routes of introduction.",
          "Most costly outbreaks trace back to a single lapse at the perimeter — which is exactly where the highest return on prevention sits.",
        ],
      },
      {
        heading: "Containing spread within",
        paragraphs: [
          "Internal biosecurity limits movement of disease between groups: separating age classes, cleaning and disinfecting between batches, and managing the flow of staff and equipment from healthy to at-risk animals.",
          "All-in, all-out management and reliable cleaning routines break the cycle that lets pathogens persist on site.",
        ],
      },
      {
        heading: "Making it routine",
        paragraphs: [
          "A programme only works if it is written down, understood and audited. Clear standard procedures, staff training and regular review turn good intentions into consistent daily practice.",
          "Backed by veterinary guidance, biosecurity shifts a farm from reacting to disease toward preventing it.",
        ],
      },
    ],
    takeaways: [
      "External biosecurity stops pathogens entering the farm.",
      "Internal measures contain anything already present.",
      "Written, audited routines are what make it effective.",
    ],
  },
  {
    slug: "organic-trace-minerals-bioavailability",
    title: "Organic Trace Minerals: Why Bioavailability Matters",
    category: "Nutrition",
    filter: "Nutrition",
    date: "April 22, 2025",
    readingTime: "5 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "How mineral form decides what the animal actually absorbs — and what it wastes.",
    href: "/blog/organic-trace-minerals-bioavailability",
    image: "/2.jpg",
    intro:
      "Trace minerals such as zinc, copper and manganese are essential to immunity, fertility and skeletal health. But the form in which they are fed determines how much the animal can truly use — and how much simply passes through.",
    sections: [
      {
        heading: "The inorganic limitation",
        paragraphs: [
          "Conventional inorganic minerals — oxides and sulphates — dissociate in the gut and can bind to other dietary components before absorption, lowering their real availability.",
          "The result is variable uptake and higher excretion, which raises both cost and environmental load.",
        ],
      },
      {
        heading: "How organic minerals differ",
        paragraphs: [
          "In organic (chelated) minerals, the metal is bound to an amino acid or peptide. This protects it through the gut and presents it to the intestinal wall in a form the animal absorbs efficiently.",
          "Greater bioavailability means the same performance can be achieved at lower inclusion — or better performance at the same level.",
        ],
      },
      {
        heading: "Performance and sustainability",
        paragraphs: [
          "Improved mineral status supports stronger immunity, better reproduction and sounder feet and legs across species.",
          "Because less mineral is excreted, organic sources also reduce the footprint of production — a benefit that matters more each year.",
        ],
      },
    ],
    takeaways: [
      "Mineral form, not just amount, determines absorption.",
      "Chelated minerals resist binding and are absorbed efficiently.",
      "Higher bioavailability improves performance and cuts excretion.",
    ],
  },
  {
    slug: "shift-toward-antibiotic-free-production",
    title: "The Global Shift Toward Antibiotic-Free Animal Production",
    category: "Industry News",
    filter: "Industry News",
    date: "April 15, 2025",
    readingTime: "6 min read",
    author: "Agriprom Technical Team",
    excerpt:
      "Why the industry is moving beyond routine antibiotics — and what replaces them.",
    href: "/blog/shift-toward-antibiotic-free-production",
    image: "/3.jpg",
    intro:
      "Across every major market, animal production is moving decisively away from the routine use of antibiotics. Driven by regulation, retailer demand and the global fight against resistance, the shift is redefining how healthy animals are raised.",
    sections: [
      {
        heading: "The forces behind the change",
        paragraphs: [
          "Antimicrobial resistance is now recognised as one of the defining health challenges of the century, and agriculture is a central part of the response. Regulators are restricting growth-promoting and preventive antibiotic use, while retailers and consumers increasingly demand antibiotic-free supply.",
          "For producers, the direction of travel is clear: routine antibiotics are being designed out of the system.",
        ],
      },
      {
        heading: "What takes their place",
        paragraphs: [
          "The alternative is not a single product but a strategy — building animal resilience so antibiotics are rarely needed. Gut-health additives, organic acids, phytogenics, precise nutrition and rigorous biosecurity each play a part.",
          "Together they support a strong immune system and a stable digestive tract, the true foundations of performance without routine medication.",
        ],
      },
      {
        heading: "A competitive advantage",
        paragraphs: [
          "Far from a constraint, antibiotic-free production is becoming a mark of quality that opens premium markets and builds consumer trust.",
          "Producers who invest early in the science of prevention are positioning themselves for where the whole industry is heading.",
        ],
      },
    ],
    takeaways: [
      "Regulation and demand are ending routine antibiotic use.",
      "Prevention — gut health, nutrition, biosecurity — replaces it.",
      "Antibiotic-free production is becoming a market advantage.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
