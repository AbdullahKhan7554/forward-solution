/**
 * Data for the poultry product detail pages. One shape drives the shared
 * ProductDetail template, so every product reads as the same premium page.
 */

export type SpecRow = { label: string; values: string[] };

export type ProductDetailData = {
  slug: string;
  /** which catalogue the product belongs to — drives back-links and CTA copy. Default "poultry". */
  catalog?: "poultry" | "ruminants";
  eyebrow: string; // e.g. "Poultry · Enzymes"
  name: string;
  intro: string; // hero scientific introduction
  overviewLead: string; // opening paragraph of the overview
  overviewPoints: string[]; // scientific bullet points
  benefits: string[];
  flow: string[]; // How It Works — ordered steps
  applications: string[];
  specs: SpecRow[];
  metaTitle: string;
  metaDescription: string;
  /** image treatment — "plate" (procedural LabPlate) or "placeholder" (drop-in). Default "plate". */
  media?: "plate" | "placeholder";
  /** gallery slot labels — defaults to Product / Packaging / Application. */
  gallery?: string[];
  /** optional scientific subtitle shown under the hero name. */
  subtitle?: string;
  /** when set, the Overview renders image-left / text-right with this placeholder label. */
  overviewImageLabel?: string;
  /** optional related products (same category); the section hides when absent. */
  related?: { name: string; blurb: string; href: string }[];
  /** optional final-CTA copy override (defaults to "Talk To Our Experts"). */
  cta?: {
    top: string;
    bottom: string;
    body: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  /** optional real image asset paths (served from /public). Overlaid on the
   *  placeholder when present; `gallery` aligns by index with the gallery labels. */
  assets?: { hero?: string; overview?: string; gallery?: string[] };
  /** optional download card labels — defaults to Brochure / Technical Sheet / MSDS. */
  downloads?: string[];
};

export const PRODUCTS: Record<string, ProductDetailData> = {
  "compound-enzyme-nsp": {
    slug: "compound-enzyme-nsp",
    assets: { hero: "/images/products/poultry/Compound-Enzyme-NSP.jpg", overview: "/images/products/poultry/Compound-Enzyme-NSP.jpg" },
    eyebrow: "Poultry · Enzymes",
    name: "KEMZYME® Poultry",
    intro:
      "A multi-enzyme complex that targets the non-starch polysaccharides in plant feed, unlocking trapped nutrients, lowering digesta viscosity and improving performance across the flock.",
    overviewLead:
      "Plant-based feeds carry non-starch polysaccharides (NSPs) that birds cannot digest on their own — trapping energy and raising gut viscosity. KEMZYME® Poultry is a balanced blend of carbohydrases that break these NSPs down, releasing more nutrients from the same feed.",
    overviewPoints: [
      "Degrades the NSP matrix in cereals and by-products.",
      "Lowers intestinal digesta viscosity for cleaner litter.",
      "Frees trapped energy, protein and fat for absorption.",
      "Supports a healthier, more balanced gut environment.",
      "Improves feed conversion and consistent performance.",
    ],
    benefits: [
      "Improves wet litter",
      "Better digestion",
      "Gut health",
      "Oil digestion",
      "Higher feed efficiency",
      "Better performance",
    ],
    flow: ["Enzyme", "Feed", "Digestion", "Nutrient Absorption", "Healthy Birds"],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      { label: "Active Ingredients", values: ["Multi-enzyme NSP complex (carbohydrases)"] },
      { label: "Technology", values: ["Enzyme Feed Supplement"] },
      { label: "Target Feed", values: ["Cereal & plant-based diets"] },
      { label: "Application", values: ["Poultry Nutrition"] },
      {
        label: "Primary Benefits",
        values: ["Lower viscosity", "Improved digestion", "Higher feed efficiency"],
      },
    ],
    metaTitle: "KEMZYME® Poultry — Agriprom Pakistan | Poultry Enzymes",
    metaDescription:
      "KEMZYME® Poultry is a multi-enzyme complex that degrades non-starch polysaccharides, lowers digesta viscosity and improves feed efficiency and poultry performance.",
  },

  "corgest-m-mannanase": {
    slug: "corgest-m-mannanase",
    assets: { hero: "/images/products/poultry/CorGest-M-Mannanase.jpg", overview: "/images/products/poultry/CorGest-M-Mannanase.jpg" },
    eyebrow: "Poultry · Enzymes",
    name: "MANNAGEST™ (Mannanase)",
    intro:
      "MANNAGEST™ contains Mannanase, an enzyme that hydrolyzes β-1,4-mannan into manno-oligosaccharides and mannose, improving nutrient utilization, feed efficiency, and poultry performance.",
    overviewLead:
      "Mannan is a component of plant cell walls that limits nutrient release and burdens digestion. MANNAGEST™ supplies Mannanase to break β-D-1,4 mannan, freeing more nutrients from corn and soy diets and supporting better growth performance.",
    overviewPoints: [
      "Mannan is a component of plant cell walls.",
      "Mannanase breaks β-D-1,4 mannan.",
      "Releases more nutrients from feed.",
      "Improves digestion and utilization.",
      "Supports better growth performance.",
    ],
    benefits: [
      "Higher nutrient availability",
      "Improved feed digestion",
      "Better growth performance",
      "Improved feed conversion ratio",
      "Reduced feed waste",
      "Enhanced poultry productivity",
    ],
    flow: [
      "Plant Cell Wall",
      "Mannan",
      "MANNAGEST™ (Mannanase)",
      "Breaks Mannan",
      "More Nutrients Released",
      "Better Growth Performance",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      { label: "Active Ingredient", values: ["Mannanase"] },
      { label: "Technology", values: ["Enzyme Feed Supplement"] },
      { label: "Target Feed", values: ["Corn & Soy Diet"] },
      { label: "Application", values: ["Poultry Nutrition"] },
      {
        label: "Primary Benefits",
        values: ["Improved Nutrient Release", "Better Feed Efficiency", "Enhanced Growth"],
      },
    ],
    metaTitle: "MANNAGEST™ (Mannanase) — Agriprom Pakistan | Poultry Enzymes",
    metaDescription:
      "MANNAGEST™ contains Mannanase, hydrolyzing β-1,4-mannan into manno-oligosaccharides and mannose to improve nutrient utilization, feed efficiency and poultry performance.",
  },

  "corgest-m": {
    slug: "corgest-m",
    assets: { hero: "/images/products/poultry/CorGest-M-Mannanase.jpg", overview: "/images/products/poultry/CorGest-M-Mannanase.jpg" },
    eyebrow: "Poultry · Enzymes",
    name: "MANNAGEST™ (Mannanase)",
    intro:
      "MANNAGEST™ is a premium Mannanase enzyme designed to improve nutrient digestibility by hydrolyzing β-mannan, enhancing feed efficiency and overall poultry performance.",
    overviewLead:
      "β-Mannan is a viscous carbohydrate locked inside the cell walls of plant-based feed ingredients like soybean meal. Birds cannot digest it, so it traps nutrients and burdens the gut. MANNAGEST™ supplies Mannanase to hydrolyze β-mannan, releasing those nutrients and improving utilization and feed conversion.",
    overviewPoints: [
      "β-Mannan is a component of plant cell walls.",
      "Mannanase hydrolyzes the β-1,4-mannan backbone.",
      "Releases trapped nutrients for absorption.",
      "Improves nutrient utilization across the diet.",
      "Enhances feed conversion and performance.",
    ],
    benefits: [
      "Improves nutrient digestibility",
      "Better feed utilization",
      "Improves growth performance",
      "Enhances feed conversion ratio",
      "Better intestinal health",
      "Cost-efficient feed formulation",
    ],
    flow: [
      "Plant Feed",
      "β-Mannan",
      "MANNAGEST™ (Mannanase)",
      "Hydrolysis",
      "Mannan Oligosaccharides",
      "Improved Nutrient Absorption",
      "Better Poultry Performance",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      { label: "Technology", values: ["Enzyme Feed Supplement"] },
      { label: "Enzyme Type", values: ["Mannanase (β-mannanase)"] },
      { label: "Target Ingredient", values: ["β-Mannan (plant cell wall)"] },
      { label: "Function", values: ["Hydrolyzes β-mannan into mannan oligosaccharides"] },
      {
        label: "Benefits",
        values: ["Improved digestibility", "Better feed conversion", "Growth performance"],
      },
      { label: "Applications", values: ["Broilers", "Layers", "Breeders", "Feed Mills"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging", "Laboratory", "Application"],
    metaTitle: "MANNAGEST™ (Mannanase) — Agriprom Pakistan | Poultry Enzyme",
    metaDescription:
      "MANNAGEST™ is a premium Mannanase enzyme that hydrolyzes β-mannan to improve nutrient digestibility, feed conversion and overall poultry performance.",
  },

  xylanase: {
    slug: "xylanase",
    assets: { hero: "/images/products/poultry/Xylanase.jpeg", overview: "/images/products/poultry/Xylanase.jpeg" },
    eyebrow: "Poultry · Enzymes",
    name: "XYGEST™ HTX",
    intro:
      "XYGEST™ HTX improves feed efficiency by hydrolyzing xylan, reducing digesta viscosity, increasing nutrient availability and supporting gut health through AXOS production.",
    overviewLead:
      "Xylan is a viscous anti-nutritional fibre in grains that hinders digestion. XYGEST™ HTX hydrolyzes xylan to reduce viscosity and generate arabinoxylan-oligosaccharides (AXOS) — prebiotics that nourish a healthy gut and lift poultry performance.",
    overviewPoints: [
      "Hydrolyzes xylan in feed grains.",
      "Reduces anti-nutritional factors.",
      "Lowers digesta viscosity.",
      "Produces AXOS prebiotics.",
      "Improves nutrient absorption.",
      "Enhances poultry performance.",
    ],
    benefits: [
      "Improved nutrient digestibility",
      "Better gut health",
      "Reduced feed viscosity",
      "AXOS prebiotic production",
      "Better feed efficiency",
      "Higher production performance",
    ],
    flow: [
      "Feed Grain",
      "Xylan",
      "Xylanase",
      "Reduced Viscosity",
      "AXOS Formation",
      "Healthy Gut",
      "Improved Performance",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Manufacturers"],
    specs: [
      { label: "Active Ingredient", values: ["Xylanase"] },
      { label: "Technology", values: ["Enzyme Technology"] },
      { label: "Target Feed", values: ["Corn, Wheat & Grain Diets"] },
      { label: "Application", values: ["Poultry Nutrition"] },
      {
        label: "Benefits",
        values: ["Reduced Viscosity", "Improved Digestion", "Gut Health", "Higher Feed Efficiency"],
      },
    ],
    metaTitle: "XYGEST™ HTX — Agriprom Pakistan | Poultry Enzyme Technology",
    metaDescription:
      "XYGEST™ HTX hydrolyzes xylan to reduce digesta viscosity, produce AXOS prebiotics, improve nutrient availability and support gut health and poultry performance.",
  },

  phytingest: {
    slug: "phytingest",
    assets: { hero: "/images/products/poultry/Phytase-768x949.jpg", overview: "/images/products/poultry/Phytase-768x949.jpg" },
    eyebrow: "Poultry · Enzymes",
    name: "PHYTINGEST™ 10 G & 20 G (Phytase)",
    intro:
      "Next-Generation Phytase (10,000 and 20,000 FTU) engineered to maximize phosphorus availability, improve nutrient utilization, and enhance poultry performance.",
    overviewLead:
      "Most phosphorus in plant-based feed is locked inside phytate, an anti-nutrient birds cannot digest. PHYTINGEST™ 10 G & 20 G is a next-generation phytase, produced by advanced microbial fermentation and engineered for superior thermostability and gut activity, that hydrolyzes phytate to release phosphorus and the nutrients bound to it.",
    overviewPoints: [
      "Next-generation phytase engineered for high activity (10,000 and 20,000 FTU).",
      "Produced by advanced microbial fermentation technology.",
      "Superior thermostability survives pelleting and storage.",
      "Hydrolyzes phytate to release bound phosphorus.",
      "Frees minerals and nutrients for absorption.",
      "Improves feed efficiency and bird performance.",
    ],
    benefits: [
      "Improves phosphorus availability",
      "Better nutrient utilization",
      "Higher feed efficiency",
      "Superior enzyme stability",
      "Better bird performance",
      "Cost-effective nutrition",
    ],
    flow: [
      "Phytate",
      "PHYTINGEST™ 10 G & 20 G",
      "Phosphorus Release",
      "Mineral Absorption",
      "Improved Digestion",
      "Higher Growth Performance",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      { label: "Enzyme Activity", values: ["(10,000 and 20,000 FTU)"] },
      { label: "Technology", values: ["Next-Generation Phytase"] },
      { label: "Fermentation Process", values: ["Advanced microbial fermentation"] },
      {
        label: "Benefits",
        values: ["Phosphorus release", "Nutrient utilization", "Superior stability"],
      },
      { label: "Target Feed", values: ["Corn & Soy diets"] },
      { label: "Applications", values: ["Broilers", "Layers", "Breeders", "Feed Mills"] },
    ],
    media: "placeholder",
    gallery: ["Product", "Packaging", "Laboratory", "Application"],
    metaTitle: "PHYTINGEST™ 10 G & 20 G (Phytase) — Agriprom Pakistan | Next-Generation Poultry Phytase",
    metaDescription:
      "PHYTINGEST™ 10 G & 20 G is a next-generation phytase (10,000 and 20,000 FTU) that maximizes phosphorus availability, improves nutrient utilization and enhances poultry performance.",
  },

  "prophorce-sr130": {
    slug: "prophorce-sr130",
    assets: { hero: "/images/products/poultry/ProPhorce-SR-130-Esterified-Butyric-Acid-768x949.jpg", overview: "/images/products/poultry/ProPhorce-SR-130-Esterified-Butyric-Acid-768x949.jpg" },
    eyebrow: "Poultry · Organic Acids (SCFA)",
    name: "ProPhorce SR 130",
    subtitle:
      "Advanced Esterified Butyric Acid Feed Premix for Improved Gut Health and Feed Efficiency",
    intro:
      "ProPhorce SR 130 is an advanced feed premix containing tri and diglycerides of butyric acid, designed to enhance gut integrity, nutrient utilization, immune response and overall poultry performance.",
    overviewLead:
      "Butyric acid is the preferred energy source of the cells lining the intestine — but conventional butyrate is pungent and released too early to reach the gut. ProPhorce SR 130 esterifies butyric acid onto a glycerol backbone (tri and diglycerides), so it is odourless, stable and released gradually along the intestinal tract exactly where it is needed.",
    overviewPoints: [
      "Esterified butyric acid — butyrate bound to glycerol.",
      "Odourless and stable through feed processing.",
      "Controlled, gradual release along the whole gut.",
      "Superior to conventional butyric acid, which is lost early.",
      "Feeds enterocytes, strengthening gut integrity.",
      "Improves nutrient utilization, immunity and performance.",
    ],
    benefits: [
      "Improves Gut Health",
      "Strengthens Immune System",
      "Improves Nutrient Efficiency",
      "Reduces Harmful Bacteria",
      "Supports Healthy Intestinal Development",
      "Better Feed Conversion Ratio (FCR)",
      "Improves Bird Performance",
      "Reduces Production Costs",
    ],
    flow: [
      "Feed",
      "ProPhorce SR130",
      "Controlled Release Butyric Acid",
      "Healthier Intestinal Cells",
      "Improved Nutrient Absorption",
      "Better Immunity",
      "Higher Growth Performance",
    ],
    applications: [
      "Broilers",
      "Layers",
      "Breeders",
      "Commercial Poultry Farms",
      "Feed Manufacturers",
    ],
    specs: [
      { label: "Product", values: ["ProPhorce SR130"] },
      { label: "Category", values: ["Organic Acids (SCFA)"] },
      { label: "Active Ingredient", values: ["Tri & Diglycerides of Butyric Acid"] },
      { label: "Application", values: ["Poultry Feed"] },
      { label: "Technology", values: ["Esterified Butyric Acid"] },
      {
        label: "Primary Benefits",
        values: ["Gut Health", "Immune Support", "Feed Efficiency", "Reduced Bacterial Threats"],
      },
    ],
    media: "placeholder",
    gallery: ["Hero Product", "Packaging", "Application"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
      {
        name: "PHYTINGEST™ 10 G & 20 G (Phytase)",
        blurb: "Next-generation phytase (10,000 and 20,000 FTU) that maximizes phosphorus availability.",
        href: "/products/poultry/phytingest",
      },
      {
        name: "XYGEST™ HTX",
        blurb: "XYGEST™ HTX reduces digesta viscosity and produces AXOS prebiotics for gut health.",
        href: "/products/poultry/xylanase",
      },
    ],
    cta: {
      top: "Ready to Improve",
      bottom: "Poultry Performance?",
      body: "Talk with our technical experts to discover how ProPhorce SR130 can improve gut health, feed efficiency and poultry productivity.",
    },
    metaTitle: "ProPhorce SR 130 (Esterified Butyric Acid) — Agriprom Pakistan | Poultry SCFA",
    metaDescription:
      "ProPhorce SR 130 is an advanced esterified butyric acid (tri & diglycerides) feed premix that enhances gut integrity, nutrient utilization, immunity and poultry performance.",
  },

  "anta-mix-me": {
    slug: "anta-mix-me",
    eyebrow: "Poultry · Organic Acids",
    name: "Anta®Mix ME",
    subtitle:
      "Acid complex with microencapsulated acids and essential oils, for poultry gut health and performance",
    intro:
      "Anta®Mix ME combines formic, lactic and phosphoric acid salts with microencapsulated acids and essential oils. It acts in the feed, the crop and stomach, and the hindgut. It also supplies highly available calcium and phosphorus.",
    overviewLead:
      "Anta®Mix ME combines formic, lactic and phosphoric acid salts with microencapsulated acids and essential oils. It acts in the feed, the crop and stomach, and the hindgut. It also supplies highly available calcium and phosphorus.",
    overviewPoints: [
      "Protected actives pass the stomach and release gradually along the gut.",
      "Provides highly available calcium and phosphorus.",
      "Free-flowing, silo-compatible, non-corrosive and does not react with other feed components.",
      "Heat stable",
    ],
    benefits: [
      "Improves Feed Intake and Palatability",
      "Improves Digestion and Nutrient Absorption",
      "Reduces Pathogen Pressure",
      "Improves Shell Quality (Better Calcium Utilisation)",
      "Reduces Mortality",
      "Better Feed Conversion Ratio (FCR) and Weight Gain",
    ],
    flow: [],
    applications: ["Broilers", "Layers", "Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["Anta®Mix ME"] },
      { label: "Category", values: ["Organic acids"] },
      { label: "Active ingredients", values: ["Formic, lactic and phosphoric acid, microencapsulated essential oils"] },
      { label: "Application", values: ["Poultry feed (broilers, layers)"] },
      { label: "Technology", values: ["Fat-encapsulated actives, released gradually by lipase in the intestine"] },
      {
        label: "Primary benefits",
        values: ["Gut health", "nutrient digestibility", "antibacterial action", "feed efficiency"],
      },
    ],
    media: "placeholder",
    gallery: ["Hero Product", "Packaging", "Application"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
      {
        name: "XYGEST™ HTX",
        blurb: "XYGEST™ HTX reduces digesta viscosity and produces AXOS prebiotics for gut health.",
        href: "/products/poultry/xylanase",
      },
    ],
    metaTitle: "Anta®Mix ME — Agriprom Pakistan | Poultry Organic Acids",
    metaDescription:
      "Acid complex with microencapsulated acids and essential oils, for poultry gut health and performance.",
  },

  "elencofix-super": {
    slug: "elencofix-super",
    assets: { hero: "/images/products/poultry/ElencoFix-Super.png", overview: "/images/products/poultry/ElencoFix-Super.png" },
    eyebrow: "Poultry · Toxin Binders",
    name: "Elenco Fix Super",
    subtitle: "Broad Spectrum Algae-Based Toxin Binder",
    intro:
      "Elenco Fix Super is an advanced broad-spectrum toxin binder formulated to protect poultry against multiple mycotoxins while supporting liver health, gut integrity, and overall production performance. Its algae-based formulation combines mineral binders with yeast cell wall technology and herbal extracts for comprehensive toxin management.",
    overviewLead:
      "Mycotoxins rarely appear alone — contaminated feed carries a mix that mineral binders alone cannot fully control. Elenco Fix Super pairs purified mineral adsorbents with yeast cell-wall technology and herbal extracts, delivering broad-spectrum binding alongside active liver protection, mould inhibition and feed-quality support.",
    overviewPoints: [
      "Broad-spectrum protection across multiple mycotoxins.",
      "Liver protection that sustains metabolic performance.",
      "Mould inhibition that safeguards feed in storage.",
      "Herbal support for gut integrity and recovery.",
      "Feed quality improvement from source to feeder.",
    ],
    benefits: [
      "Broad-spectrum toxin binding",
      "Supports liver function",
      "Reduces mold-related risks",
      "Improves gut health",
      "Better nutrient utilization",
      "Supports poultry performance",
    ],
    flow: [
      "Contaminated Feed",
      "Mycotoxins",
      "Elenco Fix Super",
      "Toxin Binding",
      "Liver Protection",
      "Healthy Birds",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      {
        label: "Ingredients",
        values: [
          "Diatomite (Purified Diatomaceous Earth)",
          "Bentonite / Montmorillonite",
          "Saccharomyces cerevisiae Yeast Cell Walls",
          "Artichoke Extract",
        ],
      },
      { label: "Technology", values: ["Broad Spectrum Algae-Based Toxin Binder"] },
      { label: "Primary Function", values: ["Mycotoxin Management"] },
      {
        label: "Benefits",
        values: ["Liver health", "Toxin adsorption", "Mould inhibition", "Enhanced performance"],
      },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "Probond",
        blurb: "Clay-based toxin binder with high cation exchange capacity for effective adsorption.",
        href: "/products/poultry/probond",
      },
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
    ],
    cta: {
      top: "Talk To Our",
      bottom: "Technical Experts",
      body: "Discover how Elenco Fix Super can protect your flock against mycotoxins while supporting liver health, gut integrity and performance.",
    },
    metaTitle: "Elenco Fix Super — Agriprom Pakistan | Broad-Spectrum Poultry Toxin Binder",
    metaDescription:
      "Elenco Fix Super is a broad-spectrum algae-based toxin binder combining mineral binders, yeast cell walls and herbal extracts to protect poultry and support liver and gut health.",
  },

  probond: {
    slug: "probond",
    assets: { hero: "/images/products/ruminants/Probond-1-768x949.jpg", overview: "/images/products/ruminants/Probond-1-768x949.jpg" },
    eyebrow: "Poultry · Toxin Binders",
    name: "Probond",
    subtitle: "Broad Spectrum Clay-Based Toxin Binder",
    intro:
      "Probond is a premium clay-based toxin binder formulated with high-purity Bentonite Montmorillonite. Its exceptional cation exchange capacity provides highly effective mycotoxin adsorption, helping poultry producers improve feed safety and animal performance.",
    overviewLead:
      "The binding power of a clay depends on the purity of its montmorillonite and its cation exchange capacity. Probond is built on high-purity Bentonite Montmorillonite selected for an exceptional exchange capacity, giving reliable, high-efficiency adsorption of mycotoxins for safer feed and stronger flock performance.",
    overviewPoints: [
      "Clay-based toxin management from high-purity montmorillonite.",
      "Feed protection that reduces mycotoxin exposure.",
      "High adsorption efficiency across contamination loads.",
      "Better flock performance from cleaner, safer feed.",
      "Reliable, consistent toxin control batch after batch.",
    ],
    benefits: [
      "Broad-spectrum toxin binding",
      "High cation exchange capacity",
      "Better feed safety",
      "Improved gut health",
      "Better nutrient utilization",
      "Supports poultry productivity",
    ],
    flow: [
      "Feed",
      "Mycotoxins",
      "Probond",
      "Adsorption",
      "Reduced Toxin Exposure",
      "Healthy Poultry",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Feed Mills"],
    specs: [
      { label: "Technology", values: ["Clay-Based Toxin Binder"] },
      { label: "Active Ingredient", values: ["Pure Bentonite Montmorillonite"] },
      { label: "Primary Function", values: ["Mycotoxin Adsorption"] },
      { label: "Special Feature", values: ["High Cation Exchange Capacity"] },
      {
        label: "Benefits",
        values: ["Toxin risk management", "Improved feed quality", "Better bird performance"],
      },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "Elenco Fix Super",
        blurb: "Algae-based broad-spectrum toxin binder with liver protection and herbal support.",
        href: "/products/poultry/elencofix-super",
      },
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
      {
        name: "PHYTINGEST™ 10 G & 20 G (Phytase)",
        blurb: "Next-generation phytase (10,000 and 20,000 FTU) that maximizes phosphorus availability.",
        href: "/products/poultry/phytingest",
      },
    ],
    cta: {
      top: "Talk To Our",
      bottom: "Technical Experts",
      body: "Discover how Probond's high-purity clay chemistry can improve feed safety, toxin control and poultry productivity on your farm.",
    },
    metaTitle: "Probond — Agriprom Pakistan | Clay-Based Poultry Toxin Binder",
    metaDescription:
      "Probond is a premium clay-based toxin binder made with high-purity Bentonite Montmorillonite, delivering high cation exchange capacity for effective mycotoxin adsorption.",
  },

  "prosid-tb-207": {
    slug: "prosid-tb-207",
    eyebrow: "Poultry · Toxin Binders",
    name: "ProSid TB 207",
    subtitle: "Multi-functional mycotoxin binder with phytogenics and calcium propionate",
    intro:
      "ProSid TB 207 is a toxin binder that adsorbs polar and non-polar mycotoxins. It also acts as a prebiotic, supports gut health and reduces oxidative stress and immunosuppression. It contains phytogenic compounds (carob, milk thistle, rosemary and licorice root) and calcium propionate.",
    overviewLead:
      "ProSid TB 207 is a toxin binder that adsorbs polar and non-polar mycotoxins. It also acts as a prebiotic, supports gut health and reduces oxidative stress and immunosuppression. It contains phytogenic compounds (carob, milk thistle, rosemary and licorice root) and calcium propionate.",
    overviewPoints: [
      "Adsorbs polar and non-polar mycotoxins.",
      "Prebiotic action supports a healthy gut microbiota.",
      "Phytogenics add antioxidant, immune and liver support.",
      "Calcium propionate protects against yeast and mold.",
      "Cost-effective",
    ],
    benefits: [
      "Binds Aflatoxin B1, Zearalenone and T-2 Toxin",
      "Supports Gut Health and Gut Microbiota",
      "Protects Liver Function",
      "Reduces Oxidative Stress and Immunosuppression",
      "Supports Nutrient Digestibility Under Mycotoxin Challenge",
      "Supports Weight Gain and Feed Conversion Ratio (FCR)",
    ],
    flow: [],
    applications: ["Broilers", "Layers", "Breeders", "Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["ProSid TB 207"] },
      { label: "Category", values: ["Toxin binder"] },
      {
        label: "Active ingredients",
        values: ["Toxin binder, phytogenics (carob, milk thistle, rosemary, licorice root), calcium propionate"],
      },
      { label: "Application", values: ["Poultry feed"] },
      { label: "Technology", values: ["Multi-functional adsorption and protection"] },
      {
        label: "Primary benefits",
        values: ["Mycotoxin binding", "gut health", "liver protection", "antioxidant support", "feed efficiency"],
      },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "Elenco Fix Super",
        blurb: "Algae-based broad-spectrum toxin binder with liver protection and herbal support.",
        href: "/products/poultry/elencofix-super",
      },
      {
        name: "Probond",
        blurb: "Clay-based toxin binder with high cation exchange capacity for effective adsorption.",
        href: "/products/poultry/probond",
      },
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
    ],
    metaTitle: "ProSid TB 207 — Agriprom Pakistan | Poultry Toxin Binder",
    metaDescription:
      "Multi-functional mycotoxin binder with phytogenics and calcium propionate.",
  },

  "compound-antioxidant": {
    slug: "compound-antioxidant",
    eyebrow: "Poultry · Antioxidants",
    name: "Compound Antioxidant",
    subtitle: "Synergistic Feed Antioxidant for Nutrient Preservation & Feed Stability",
    intro:
      "Compound Antioxidant is a scientifically balanced antioxidant formulation designed to protect oil and fat-soluble vitamins while improving feed stability, nutrient preservation, and poultry performance.",
    overviewLead:
      "Compound Antioxidant is formulated using Ethoxyquinolone (EQ) and Butylated Hydroxytoluene (BHT). Their synergistic combination delivers 2–4 times greater antioxidant activity than the individual antioxidants alone — designed to preserve feed quality and protect nutrients throughout storage and production.",
    overviewPoints: [
      "Synergistic EQ + BHT blend.",
      "2–4× greater activity than single antioxidants.",
      "Protects oils and fat-soluble vitamins.",
      "Preserves feed quality in storage and production.",
      "Stabilizes nutrients from mill to feeder.",
    ],
    benefits: [
      "Protects oil and fat-soluble vitamins",
      "Extends feed shelf life",
      "Prevents oxidation",
      "Improves nutrient preservation",
      "Higher antioxidant efficiency",
      "Supports better poultry performance",
    ],
    flow: [
      "Antioxidant Blend",
      "Protects Nutrients",
      "Reduces Oxidation",
      "Maintains Feed Quality",
      "Improves Poultry Performance",
    ],
    applications: ["Broilers", "Layers", "Breeders", "Commercial Feed Mills"],
    specs: [
      { label: "Product Name", values: ["Compound Antioxidant"] },
      { label: "Category", values: ["Antioxidants"] },
      {
        label: "Active Ingredients",
        values: ["Ethoxyquinolone (EQ)", "Butylated Hydroxytoluene (BHT)"],
      },
      { label: "Technology", values: ["Synergistic Antioxidant Blend"] },
      { label: "Target Feed", values: ["Poultry Feed"] },
      {
        label: "Benefits",
        values: ["Higher oxidation protection", "Improved feed stability", "Better vitamin preservation"],
      },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging", "Application Image"],
    overviewImageLabel: "Product Overview",
    assets: {
      hero: "/images/products/poultry/Bornsun-Antioxidant-Q1-768x949.jpg",
      overview: "/images/products/poultry/Bornsun-Antioxidant-Q1-768x949.jpg",
    },
    related: [
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
      {
        name: "Elenco Fix Super",
        blurb: "Algae-based broad-spectrum toxin binder with liver protection and herbal support.",
        href: "/products/poultry/elencofix-super",
      },
    ],
    cta: {
      top: "Need Technical",
      bottom: "Support?",
      body: "Our technical experts are ready to help you choose the right antioxidant solution for your operation.",
    },
    metaTitle: "Compound Antioxidant — Agriprom Pakistan | Synergistic Poultry Feed Antioxidant",
    metaDescription:
      "Compound Antioxidant is a synergistic EQ + BHT feed antioxidant delivering 2–4× greater activity to protect fat-soluble vitamins, extend feed shelf life and improve poultry performance.",
  },

  lysolip: {
    slug: "lysolip",
    assets: { hero: "/images/products/poultry/LysoLip-768x949.jpg", overview: "/images/products/poultry/LysoLip-768x949.jpg" },
    eyebrow: "Poultry · Emulsifier",
    name: "LysoLip",
    subtitle: "Lysophospholipid-Based Feed Emulsifier for Fat Digestion & Gut Health",
    intro:
      "LysoLip is a lysophospholipid-based emulsifier developed to improve fat digestion, nutrient absorption, liver health, and overall poultry performance. It enhances intestinal morphology, supports microbiota activity, and increases feed efficiency for modern poultry production.",
    overviewLead:
      "LysoLip is a lysophospholipid-based emulsifier containing approximately 6.5% lysophospholipids. It improves fat digestion and nutrient utilization while enhancing intestinal morphology and microbiota activity in poultry. It also supports liver health and promotes lipid metabolism in both the gastrointestinal tract and the liver.",
    overviewPoints: [
      "Lysophospholipid-based emulsifier (~6.5% lysophospholipids).",
      "Improves fat digestion and nutrient utilization.",
      "Enhances intestinal morphology and microbiota activity.",
      "Supports liver health and lipid metabolism.",
      "Increases feed efficiency across the flock.",
    ],
    benefits: [
      "Improves fat digestion",
      "Better nutrient absorption",
      "Enhances intestinal morphology",
      "Supports healthy gut microbiota",
      "Improves feed conversion ratio",
      "Supports liver health",
      "Improves offspring body weight in breeders",
      "Enhances lipid metabolism",
    ],
    flow: [
      "LysoLip",
      "Improves Fat Emulsification",
      "Better Lipid Digestion",
      "Higher Nutrient Absorption",
      "Improved Gut Health",
      "Higher Poultry Performance",
    ],
    applications: [
      "Broilers",
      "Layers",
      "Breeders",
      "Commercial Feed Mills",
      "Poultry Nutrition Programs",
    ],
    specs: [
      { label: "Product", values: ["LysoLip"] },
      { label: "Category", values: ["Emulsifier"] },
      { label: "Technology", values: ["Lysophospholipid-Based Feed Emulsifier"] },
      { label: "Active Component", values: ["Approximately 6.5% Lysophospholipids"] },
      {
        label: "Primary Benefits",
        values: [
          "Improves Fat Digestion",
          "Supports Liver Health",
          "Enhances Gut Function",
          "Optimizes Feed Efficiency",
        ],
      },
      { label: "Target Animal", values: ["Poultry"] },
    ],
    media: "placeholder",
    gallery: ["Product Packaging", "Application Image", "Technical Illustration"],
    overviewImageLabel: "Product Overview",
    related: [
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
      {
        name: "ProPhorce SR 130",
        blurb: "Esterified butyric acid premix for gut integrity, immunity and feed efficiency.",
        href: "/products/poultry/organic-acids-scfa/prophorce-sr130",
      },
      {
        name: "PHYTINGEST™ 10 G & 20 G (Phytase)",
        blurb: "Next-generation phytase (10,000 and 20,000 FTU) that maximizes phosphorus availability.",
        href: "/products/poultry/phytingest",
      },
    ],
    cta: {
      top: "Need Technical",
      bottom: "Guidance?",
      body: "Speak with our technical specialists to find the right nutritional solution for your poultry operation.",
      primaryLabel: "Contact Expert",
      secondaryLabel: "View All Poultry Products",
      secondaryHref: "/products/poultry",
    },
    metaTitle: "LysoLip — Agriprom Pakistan | Lysophospholipid Poultry Emulsifier",
    metaDescription:
      "LysoLip is a lysophospholipid-based feed emulsifier (~6.5% lysophospholipids) that improves fat digestion, nutrient absorption, gut health, liver health and poultry performance.",
  },

  "minlex-poultry": {
    slug: "minlex-poultry",
    assets: { hero: "/images/products/poultry/Minlex-Poultry.jpg", overview: "/images/products/poultry/Minlex-Poultry.jpg" },
    eyebrow: "Poultry · Organic Minerals",
    name: "Minlex Poultry",
    subtitle: "Amino-Acid Chelated Organic Trace Minerals for Health & Productivity",
    intro:
      "Minlex Poultry is a scientifically formulated combination of organic trace minerals chelated with amino acids (Biochelation). It supplies essential trace elements that improve poultry health, immunity, growth performance, skeletal development, and feed efficiency for higher productivity.",
    overviewLead:
      "Inorganic mineral salts are poorly absorbed and easily antagonised in the gut. Minlex Poultry chelates trace minerals with amino acids (Biochelation), protecting them through digestion and delivering them in a highly bioavailable form — so birds absorb more from less, with better health and productivity.",
    overviewPoints: [
      "Amino-acid chelated trace minerals (Biochelation).",
      "High bioavailability versus inorganic salts.",
      "Better mineral absorption with less antagonism.",
      "Improved health, immunity and skeletal development.",
      "Better productivity and feed efficiency.",
    ],
    benefits: [
      "Improves poultry health",
      "Strengthens immunity",
      "Enhances growth performance",
      "Improves skeletal development",
      "Optimizes feed efficiency",
      "Supports better productivity",
    ],
    flow: [
      "Organic Chelated Minerals",
      "Improved Absorption",
      "Better Cellular Function",
      "Enhanced Immunity",
      "Healthy Growth",
      "Higher Feed Efficiency",
      "Improved Poultry Performance",
    ],
    applications: [
      "Broilers",
      "Layers",
      "Breeders",
      "Commercial Poultry Farms",
      "Feed Mills",
    ],
    specs: [
      { label: "Product Name", values: ["Minlex Poultry"] },
      { label: "Technology", values: ["Biochelated Organic Trace Minerals"] },
      {
        label: "Contains",
        values: ["Iron", "Copper", "Zinc", "Manganese", "Iodine", "Chromium", "Selenium", "Cobalt"],
      },
      { label: "Application", values: ["Poultry Feed"] },
      {
        label: "Primary Benefits",
        values: ["Improved Immunity", "Growth Performance", "Feed Efficiency", "Bone Development"],
      },
    ],
    media: "placeholder",
    gallery: ["Product Packaging", "Product Close-up", "Application Image"],
    overviewImageLabel: "Product Overview",
    downloads: ["Product Brochure", "Technical Data Sheet", "MSDS", "PDF Specification"],
    related: [
      {
        name: "KEMZYME® Poultry",
        blurb: "A multi-enzyme NSP complex that unlocks trapped nutrients and lowers gut viscosity.",
        href: "/products/poultry/compound-enzyme-nsp",
      },
      {
        name: "MANNAGEST™ (Mannanase)",
        blurb: "Mannanase that hydrolyzes β-mannan to improve digestibility and feed conversion.",
        href: "/products/poultry/corgest-m",
      },
      {
        name: "XYGEST™ HTX",
        blurb: "XYGEST™ HTX reduces digesta viscosity and produces AXOS prebiotics for gut health.",
        href: "/products/poultry/xylanase",
      },
      {
        name: "PHYTINGEST™ 10 G & 20 G (Phytase)",
        blurb: "Next-generation phytase (10,000 and 20,000 FTU) that maximizes phosphorus availability.",
        href: "/products/poultry/phytingest",
      },
    ],
    cta: {
      top: "Improve Poultry Performance with",
      bottom: "Scientifically Balanced Organic Minerals",
      body: "Talk with our technical experts about a scientifically balanced organic trace-mineral programme for your flock.",
      primaryLabel: "Talk To Our Experts",
    },
    metaTitle: "Minlex Poultry — Agriprom Pakistan | Chelated Organic Trace Minerals",
    metaDescription:
      "Minlex Poultry is a biochelated organic trace-mineral premix (amino-acid chelated) that improves poultry immunity, growth, skeletal development and feed efficiency.",
  },

  "alterion-ne": {
    slug: "alterion-ne",
    eyebrow: "Poultry · Probiotics",
    name: "Alterion NE",
    subtitle:
      "Bacillus subtilis probiotic for gut health and poultry performance",
    intro:
      "Alterion NE is a direct-fed microbial based on Bacillus subtilis. It strengthens gut health in three layers: the microbiota, the gut epithelium (barrier) and the immune response. This makes the gut less favourable to opportunistic pathogens such as C. perfringens.",
    overviewLead:
      "Alterion NE is a direct-fed microbial based on Bacillus subtilis. It strengthens gut health in three layers: the microbiota, the gut epithelium (barrier) and the immune response. This makes the gut less favourable to opportunistic pathogens such as C. perfringens.",
    overviewPoints: [
      "Proven germination in the gut",
      "Heat stable",
      "Free-flowing powder with good compressibility.",
      "Compatible with ionophore coccidiostats and antibiotic growth promoters.",
      "Can be combined with feed enzymes for complementary effects.",
    ],
    benefits: [
      "Improves Gut Health and Resilience",
      "Supports Intestinal Villus Development",
      "Strengthens the Gut Epithelial Barrier",
      "Supports a Balanced Immune Response",
      "Reduces Pathogen Pressure (incl. C. perfringens)",
      "Supports Weight Gain and Feed Conversion Ratio (FCR)",
    ],
    flow: [],
    applications: ["Broilers", "Layers", "Breeders", "Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["Alterion NE"] },
      { label: "Category", values: ["Probiotic"] },
      { label: "Active ingredient", values: ["Bacillus subtilis (1 × 10¹⁰ CFU/g)"] },
      { label: "Application", values: ["Poultry feed"] },
      { label: "Technology", values: ["Heat-stable spores, germinating in the gut"] },
      { label: "Primary benefits", values: ["Gut health", "intestinal integrity", "pathogen resilience", "performance"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    metaTitle: "Alterion NE — Agriprom Pakistan | Poultry Probiotics",
    metaDescription:
      "Bacillus subtilis probiotic for gut health and poultry performance.",
  },

  "antifly": {
    slug: "antifly",
    eyebrow: "Poultry · Fly Control",
    name: "Antifly",
    subtitle:
      "Poultry feed premix for fly control through larvae growth regulation",
    intro:
      "Antifly is a feed additive containing cyromazine, an insect growth regulator. About 99.9% of the dose passes through the bird and is excreted in the manure. There it stops fly larvae from developing into adult flies, which breaks the breeding cycle and reduces fly numbers in the poultry house.",
    overviewLead:
      "Antifly is a feed additive containing cyromazine, an insect growth regulator. About 99.9% of the dose passes through the bird and is excreted in the manure. There it stops fly larvae from developing into adult flies, which breaks the breeding cycle and reduces fly numbers in the poultry house.",
    overviewPoints: [
      "Cyromazine inhibits chitin synthesis in the fly exoskeleton and disrupts the hormones that regulate its growth.",
      "Stops eggs, larvae and pupae from developing into adult flies.",
      "The product is safe for poultry.",
      "Start early, before fly season (around March), and continue until the end of summer (around September).",
      "Add to feed only, and mix well.",
    ],
    benefits: [
      "Controls Fly Breeding in Manure",
      "Reduces Fly-Borne Disease Risk (Viral and Bacterial)",
      "Reduces Ammonia and Odour in Poultry Houses",
      "Reduces Stress Caused by Flies",
      "Improves Egg and Manure Quality",
      "Easy to Use and Cost Effective",
    ],
    flow: [],
    applications: ["Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["Antifly"] },
      { label: "Category", values: ["Insect growth regulator (larvicide) premix"] },
      { label: "Active ingredient", values: ["Cyromazine (triazine class)"] },
      { label: "Application", values: ["Poultry feed"] },
      { label: "Technology", values: ["Cellulose-coated, passes through the bird and acts in the manure"] },
      { label: "Primary benefits", values: ["Fly control", "disease prevention", "ammonia and odour reduction"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    metaTitle: "Antifly — Agriprom Pakistan | Poultry Fly Control",
    metaDescription:
      "Poultry feed premix for fly control through larvae growth regulation.",
  },

  "canthaxanthin-lutein": {
    slug: "canthaxanthin-lutein",
    eyebrow: "Poultry · Feed Pigment",
    name: "Canthaxanthin & Lutein Feed Pigment",
    subtitle:
      "Red and yellow carotenoid pigments for egg yolk and broiler skin colour",
    intro:
      "Corn-based diets don't carry enough carotenoids for the colour consumers want. Supplementing with natural red and yellow pigments builds a deeper orange yolk and richer skin and shank colour.",
    overviewLead:
      "Corn-based diets don't carry enough carotenoids for the colour consumers want. Supplementing with natural red and yellow pigments builds a deeper orange yolk and richer skin and shank colour.",
    overviewPoints: [
      "Well absorbed by the bird.",
      "Free-flowing powder and granule forms that mix evenly into feed.",
      "Dosage adjusts to the corn level in the diet.",
      "Premix before the mixer, since the amounts are very small.",
    ],
    benefits: [
      "Deeper, More Uniform Egg Yolk Colour",
      "Richer Broiler Skin and Shank Colour",
      "Natural Yellow Base from Marigold Extract",
      "Red Pigment for High Colour Scores",
      "Supports Consumer Appeal and Perceived Quality",
      "Cost-Effective Colour Programme",
    ],
    flow: [],
    applications: ["Layers", "Broilers", "Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["Canthaxanthin & Lutein (Red and Yellow)"] },
      { label: "Category", values: ["Feed pigments"] },
      { label: "Active ingredients", values: ["Red: canthaxanthin 10%", "Yellow: lutein 2%"] },
      { label: "Application", values: ["Poultry feed (layers, broilers)"] },
      { label: "Technology", values: ["Free-flowing powder (yellow) and granule (red), premixed before the mixer"] },
      { label: "Primary benefits", values: ["Yolk colour", "skin and shank colour", "consistent product appearance"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    metaTitle: "Canthaxanthin & Lutein Feed Pigment — Agriprom Pakistan | Poultry Feed Pigment",
    metaDescription:
      "Red and yellow carotenoid pigments for egg yolk and broiler skin colour.",
  },

  "moldcid": {
    slug: "moldcid",
    eyebrow: "Poultry · Feed Hygienizer",
    name: "MoldCid",
    subtitle:
      "Propionic acid–based feed preservative against mold and spoilage",
    intro:
      "MoldCid is a blend of propionic acid with its ammonium and calcium salts on a mineral carrier. The mix of free acids and salts gives a long-lasting effect. It controls mold growth, protects feed and grain from spoilage and keeps nutrient and dry matter losses low.",
    overviewLead:
      "MoldCid is a blend of propionic acid with its ammonium and calcium salts on a mineral carrier. The mix of free acids and salts gives a long-lasting effect. It controls mold growth, protects feed and grain from spoilage and keeps nutrient and dry matter losses low.",
    overviewPoints: [
      "Long-lasting effect from the free acid and salt combination.",
      "Free-flowing",
      "Non-corrosive and easy to handle, with a particle size that suits easy dosing.",
    ],
    benefits: [
      "Controls Mold Growth in Feed and Grain",
      "Protects Against Nutrient and Dry Matter Losses",
      "Improves Feed Hygiene",
      "Helps Prevent Mycotoxins and Biogenic Amines",
      "Supports Healthy Feed, Lower Mortality and Better Feed Efficiency",
      "Reduces Feed Costs from Spoilage",
    ],
    flow: [],
    applications: ["Feed Manufacturers", "Commercial Poultry Farms", "Grain Storage"],
    specs: [
      { label: "Product", values: ["MoldCid"] },
      { label: "Category", values: ["Feed Hygienizer"] },
      { label: "Active ingredients", values: ["Propionic acid, ammonium propionate, calcium propionate"] },
      { label: "Application", values: ["Compound feed and grain"] },
      { label: "Technology", values: ["Free acids plus salts on a mineral carrier, with steady release into the feed"] },
      { label: "Primary benefits", values: ["Antifungal protection", "feed hygiene", "reduced nutrient and dry matter losses"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    metaTitle: "MoldCid — Agriprom Pakistan | Poultry Feed Hygienizer",
    metaDescription:
      "Propionic acid–based feed preservative against mold and spoilage.",
  },

  "coxield": {
    slug: "coxield",
    eyebrow: "Poultry · Phytogenic Anticoccidials",
    name: "Coxield",
    subtitle:
      "Phytogenic anticoccidial with three modes of action",
    intro:
      "Coxield is a natural alternative to anticoccidial drugs, made from a blend of two phytogenics. It acts on the early phase of the Eimeria life cycle in three ways. It kills sporozoites directly, blocks their invasion of gut cells and slows merozoite multiplication inside the cells. This supports broiler growth and reduces oocyst discharge and lesion score.",
    overviewLead:
      "Coxield is a natural alternative to anticoccidial drugs, made from a blend of two phytogenics. It acts on the early phase of the Eimeria life cycle in three ways. It kills sporozoites directly, blocks their invasion of gut cells and slows merozoite multiplication inside the cells. This supports broiler growth and reduces oocyst discharge and lesion score.",
    overviewPoints: [
      "Kills sporozoites, inhibits cell invasion and suppresses merozoite proliferation.",
      "No withdrawal period and no residue issues.",
      "Less resistance risk than anticoccidial drugs.",
      "Faster protection than vaccines.",
      "Selected through screening of natural ingredients.",
    ],
    benefits: [
      "Kills Sporozoites Directly",
      "Inhibits Cell Invasion",
      "Suppresses Merozoite Proliferation",
      "Reduces Oocyst Discharge and Lesion Score",
      "Supports Broiler Growth Performance and FCR",
      "Natural Alternative to Chemical Anticoccidial Drugs",
    ],
    flow: [],
    applications: ["Broilers", "Layers", "Breeders", "Commercial Poultry Farms", "Feed Manufacturers"],
    specs: [
      { label: "Product", values: ["Coxield"] },
      { label: "Category", values: ["Phytogenic anticoccidial"] },
      { label: "Active ingredients", values: ["Blend of two phytogenics"] },
      { label: "Application", values: ["Poultry feed"] },
      { label: "Technology", values: ["Triple mode of action against Eimeria"] },
      { label: "Primary benefits", values: ["Coccidiosis control", "gut protection", "growth performance"] },
    ],
    media: "placeholder",
    gallery: ["Product Image", "Packaging Image", "Application Image"],
    overviewImageLabel: "Product Overview",
    metaTitle: "Coxield — Agriprom Pakistan | Poultry Phytogenic Anticoccidials",
    metaDescription:
      "Phytogenic anticoccidial with three modes of action.",
  },

  // ─── Ruminants ─────────────────────────────────────────────────────────
  "ruminants/rumen-protected-amino-acids/matrixin": {
    slug: "matrixin",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/Matrixin.jpg" },
    eyebrow: "Ruminants · Rumen Protected Amino Acids",
    name: "MATRIXIN",
    subtitle: "RP Lysine",
    intro:
      "Premium rumen protected lysine designed to maximize amino acid availability and improve milk production.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Better milk yield",
      "Improved protein synthesis",
      "Better fertility",
      "Increased feed efficiency",
    ],
    flow: [],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows"],
    specs: [
      { label: "Category", values: ["RP Lysine"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Form", values: ["Granules"] },
      { label: "Packaging", values: ["25 KG"] },
    ],
    metaTitle: "MATRIXIN — Agriprom Pakistan | Ruminant Rumen Protected Amino Acids",
    metaDescription:
      "Premium rumen protected lysine designed to maximize amino acid availability and improve milk production.",
  },
  "ruminants/rumen-protected-amino-acids/matonin": {
    slug: "matonin",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/Matonin.jpg" },
    eyebrow: "Ruminants · Rumen Protected Amino Acids",
    name: "MATONIN",
    subtitle: "RP Methionine",
    intro:
      "Premium rumen protected methionine designed to maximize amino acid availability and improve milk production.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Better milk yield",
      "Improved protein synthesis",
      "Better fertility",
      "Increased feed efficiency",
    ],
    flow: [],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows"],
    specs: [
      { label: "Category", values: ["RP Methionine"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Form", values: ["Granules"] },
      { label: "Packaging", values: ["25 KG"] },
    ],
    metaTitle: "MATONIN — Agriprom Pakistan | Ruminant Rumen Protected Amino Acids",
    metaDescription:
      "Premium rumen protected methionine designed to maximize amino acid availability and improve milk production.",
  },
  "ruminants/toxin-binders/banebe": {
    slug: "banebe",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/BaneBe-768x949.jpg" },
    eyebrow: "Ruminants · Toxin Binders",
    name: "BaneBe",
    subtitle: "Toxin Binder",
    intro:
      "Advanced mycotoxin binder formulated to reduce the harmful effects of feed-borne mycotoxins, supporting healthier livestock, improved feed efficiency, and optimal production performance.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Binds harmful mycotoxins",
      "Improves feed quality",
      "Supports liver health",
      "Enhances immunity",
      "Increases productivity",
    ],
    flow: [],
    applications: ["Dairy Farms", "Beef Cattle Farms", "Commercial Feed Mills", "Livestock Nutrition Programs"],
    specs: [
      { label: "Category", values: ["Toxin Binder"] },
      { label: "Species", values: ["Ruminants"] },
      { label: "Form", values: ["Powder / Granules"] },
      { label: "Packaging", values: ["25 KG"] },
    ],
    metaTitle: "BaneBe — Agriprom Pakistan | Ruminant Toxin Binders",
    metaDescription:
      "Advanced mycotoxin binder formulated to reduce the harmful effects of feed-borne mycotoxins, supporting healthier livestock, improved feed efficiency, and optimal production performance.",
  },
  "ruminants/toxin-binders/elencofix-super": {
    slug: "elencofix-super",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/ElencoFix-Super-768x949.jpg" },
    eyebrow: "Ruminants · Toxin Binders",
    name: "ELENCOFIX SUPER",
    subtitle: "Toxin Binder",
    intro:
      "Premium broad-spectrum mycotoxin binder developed to protect livestock against multiple toxin challenges while maintaining animal performance and feed safety.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Broad-spectrum toxin protection",
      "Supports digestive health",
      "Improves nutrient absorption",
      "Maintains production efficiency",
      "Reduces mycotoxin risks",
    ],
    flow: [],
    applications: ["Dairy Farms", "Feed Manufacturing Plants", "Commercial Livestock Operations", "Nutrition Programs"],
    specs: [
      { label: "Category", values: ["Toxin Binder"] },
      { label: "Species", values: ["Ruminants"] },
      { label: "Form", values: ["Powder"] },
      { label: "Packaging", values: ["25 KG"] },
      { label: "Manufacturer", values: ["Elanco"] },
    ],
    metaTitle: "ELENCOFIX SUPER — Agriprom Pakistan | Ruminant Toxin Binders",
    metaDescription:
      "Premium broad-spectrum mycotoxin binder developed to protect livestock against multiple toxin challenges while maintaining animal performance and feed safety.",
  },
  "ruminants/organic-minerals/minlex-cattle": {
    slug: "minlex-cattle",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/Minlex-Cattle-768x949.jpg" },
    eyebrow: "Ruminants · Organic Minerals",
    name: "MINLEX CATTLE",
    subtitle: "Organic Trace Minerals",
    intro:
      "MINLEX CATTLE is a premium organic trace mineral solution formulated to improve mineral bioavailability, strengthen immunity, support reproductive performance, and enhance overall productivity in dairy and beef cattle. Its highly bioavailable organic mineral complexes ensure superior absorption and optimal animal performance.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Superior mineral absorption",
      "Supports stronger immunity",
      "Improves reproductive performance",
      "Enhances milk production and growth",
      "Better hoof and bone development",
      "Improves feed efficiency",
      "Reduces mineral deficiencies",
    ],
    flow: [],
    applications: ["Dairy Farms", "Beef Cattle Farms", "Commercial Livestock Operations", "Mineral Supplementation Programs", "High Performance Feeding Programs"],
    specs: [
      { label: "Category", values: ["Organic Trace Minerals"] },
      { label: "Species", values: ["Dairy & Beef Cattle"] },
    ],
    metaTitle: "MINLEX CATTLE — Agriprom Pakistan | Ruminant Organic Minerals",
    metaDescription:
      "MINLEX CATTLE is a premium organic trace mineral solution formulated to improve mineral bioavailability, strengthen immunity, support reproductive performance, and enhance overall productivity in dairy and beef cattle. Its highly bioavailable organic mineral complexes ensure superior absorption and optimal animal performance.",
  },
  "ruminants/biosecurity/cleanex": {
    slug: "cleanex",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/CleanEx-768x949.jpg" },
    eyebrow: "Ruminants · Biosecurity Solutions",
    name: "CleanEx",
    subtitle: "Biosecurity Solution",
    intro:
      "CleanEx is an advanced cleaning solution designed for livestock facilities and Clean-In-Place (CIP) systems. It removes organic residues and prepares equipment and housing areas for effective disinfection, supporting optimal farm biosecurity.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Deep cleaning performance",
      "Removes organic deposits and biofilm",
      "Enhances disinfectant effectiveness",
      "Supports Clean-In-Place (CIP) systems",
      "Improves overall farm sanitation",
    ],
    flow: [],
    applications: ["Dairy Processing Equipment", "Milking Systems", "Poultry Farms", "Livestock Facilities", "Water Lines", "Feed Equipment"],
    specs: [
      { label: "Category", values: ["Biosecurity Solution"] },
      { label: "Species", values: ["Poultry, Dairy Cattle, Sheep & Goats"] },
      { label: "Form", values: ["Liquid Cleaner"] },
    ],
    metaTitle: "CleanEx — Agriprom Pakistan | Ruminant Biosecurity Solutions",
    metaDescription:
      "CleanEx is an advanced cleaning solution designed for livestock facilities and Clean-In-Place (CIP) systems. It removes organic residues and prepares equipment and housing areas for effective disinfection, supporting optimal farm biosecurity.",
  },
  "ruminants/biosecurity/germex": {
    slug: "germex",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/GremEx.jpg" },
    eyebrow: "Ruminants · Biosecurity Solutions",
    name: "GermEx",
    subtitle: "Biosecurity Solution",
    intro:
      "GermEx is a broad-spectrum disinfectant that eliminates bacteria, viruses, fungi and harmful pathogens across livestock facilities and equipment — the disinfection step that follows cleaning for complete farm biosecurity.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Broad-spectrum pathogen control",
      "Eliminates bacteria, viruses & fungi",
      "Most effective after CleanEx cleaning",
      "Reduces disease pressure on the farm",
      "Supports complete biosecurity protocols",
    ],
    flow: [],
    applications: ["Poultry Farms", "Livestock Facilities", "Milking Systems", "Water Lines", "Feed Equipment", "Footbaths"],
    specs: [
      { label: "Category", values: ["Biosecurity Solution"] },
      { label: "Species", values: ["Poultry, Dairy Cattle, Sheep & Goats"] },
      { label: "Form", values: ["Liquid Disinfectant"] },
    ],
    metaTitle: "GermEx — Agriprom Pakistan | Ruminant Biosecurity Solutions",
    metaDescription:
      "GermEx is a broad-spectrum disinfectant that eliminates bacteria, viruses, fungi and harmful pathogens across livestock facilities and equipment — the disinfection step that follows cleaning for complete farm biosecurity.",
  },
  "ruminants/comfort/puzzle-comfort-mat": {
    slug: "puzzle-comfort-mat",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/puzzle-comfort-mat.webp" },
    eyebrow: "Ruminants · Comfort Solutions",
    name: "Puzzle Comfort Mat",
    subtitle: "Comfort Solution",
    intro:
      "Puzzle Comfort Mat is a premium dairy flooring solution designed to provide superior comfort, reduce leg fatigue, improve cow welfare, and enhance overall productivity in modern dairy farms.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Reduces leg and hoof stress",
      "Improves cow comfort",
      "Minimizes slipping injuries",
      "Supports higher milk production",
      "Long-lasting heavy-duty construction",
    ],
    flow: [],
    applications: ["Dairy Farms", "Milking Parlors", "Resting Areas", "Walking Alleys"],
    specs: [
      { label: "Category", values: ["Comfort Solution"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Material", values: ["High-Density Rubber"] },
      { label: "Surface", values: ["Anti-Slip"] },
      { label: "Installation", values: ["Interlocking Puzzle Design"] },
    ],
    metaTitle: "Puzzle Comfort Mat — Agriprom Pakistan | Ruminant Comfort Solutions",
    metaDescription:
      "Puzzle Comfort Mat is a premium dairy flooring solution designed to provide superior comfort, reduce leg fatigue, improve cow welfare, and enhance overall productivity in modern dairy farms.",
  },
  "ruminants/comfort/mammouth-mattress": {
    slug: "mammouth-mattress",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/mammouth-mattress.webp" },
    eyebrow: "Ruminants · Comfort Solutions",
    name: "Mammouth Mattress",
    subtitle: "Comfort Solution",
    intro:
      "Mammouth Mattress delivers exceptional lying comfort for dairy cows by combining advanced cushioning technology with durable construction to improve animal welfare and productivity.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Improves resting time",
      "Reduces lameness",
      "Better udder health",
      "Increased milk yield",
      "Long service life",
    ],
    flow: [],
    applications: ["Dairy Barns", "Free Stall Systems", "Commercial Dairy Farms"],
    specs: [
      { label: "Category", values: ["Comfort Solution"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Material", values: ["Premium Foam & Rubber"] },
      { label: "Surface", values: ["Comfortable Soft Layer"] },
      { label: "Installation", values: ["Stall Mattress System"] },
    ],
    metaTitle: "Mammouth Mattress — Agriprom Pakistan | Ruminant Comfort Solutions",
    metaDescription:
      "Mammouth Mattress delivers exceptional lying comfort for dairy cows by combining advanced cushioning technology with durable construction to improve animal welfare and productivity.",
  },
  "ruminants/comfort/eva-horse-stable-mat": {
    slug: "eva-horse-stable-mat",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/eva-horse-stable-mat.webp" },
    eyebrow: "Ruminants · Comfort Solutions",
    name: "EVA Horse Stable Mat",
    subtitle: "Comfort Solution",
    intro:
      "EVA Horse Stable Mat is designed to provide maximum comfort, shock absorption, and slip resistance for horses while creating a cleaner and safer stable environment.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Excellent shock absorption",
      "Improves horse comfort",
      "Easy cleaning",
      "Reduces fatigue",
      "Durable and lightweight",
    ],
    flow: [],
    applications: ["Horse Stables", "Equestrian Centers", "Veterinary Facilities", "Training Farms"],
    specs: [
      { label: "Category", values: ["Comfort Solution"] },
      { label: "Species", values: ["Horses"] },
      { label: "Material", values: ["EVA Foam"] },
      { label: "Surface", values: ["Anti-Slip"] },
      { label: "Installation", values: ["Stable Flooring"] },
    ],
    metaTitle: "EVA Horse Stable Mat — Agriprom Pakistan | Ruminant Comfort Solutions",
    metaDescription:
      "EVA Horse Stable Mat is designed to provide maximum comfort, shock absorption, and slip resistance for horses while creating a cleaner and safer stable environment.",
  },
  "ruminants/comfort/standard-self-locks": {
    slug: "standard-self-locks",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/standard-self-locks.webp" },
    eyebrow: "Ruminants · Comfort Solutions",
    name: "Standard Self Locks",
    subtitle: "Livestock Management",
    intro:
      "Standard Self Locks provide a safe, efficient, and reliable livestock handling solution, allowing easy animal management during feeding, treatment, and routine farm operations.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Safe animal handling",
      "Improves farm efficiency",
      "Reduces labor requirements",
      "Heavy-duty construction",
      "Long operational life",
    ],
    flow: [],
    applications: ["Dairy Farms", "Feeding Stations", "Livestock Facilities", "Commercial Farms"],
    specs: [
      { label: "Category", values: ["Livestock Management"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Material", values: ["Galvanized Steel"] },
      { label: "Finish", values: ["Corrosion Resistant"] },
      { label: "Installation", values: ["Feeding System"] },
    ],
    metaTitle: "Standard Self Locks — Agriprom Pakistan | Ruminant Comfort Solutions",
    metaDescription:
      "Standard Self Locks provide a safe, efficient, and reliable livestock handling solution, allowing easy animal management during feeding, treatment, and routine farm operations.",
  },
  "ruminants/comfort/free-stall-systems": {
    slug: "free-stall-systems",
    catalog: "ruminants",
    media: "placeholder",
    assets: { hero: "/images/products/ruminants/free-stall-system.webp" },
    eyebrow: "Ruminants · Comfort Solutions",
    name: "Free Stall Systems",
    subtitle: "Housing Solution",
    intro:
      "Free Stall Systems are engineered to maximize cow comfort, improve barn organization, enhance hygiene, and support higher productivity in modern dairy operations.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Enhances animal welfare",
      "Better space utilization",
      "Improves hygiene",
      "Supports higher milk production",
      "Long-lasting structural design",
    ],
    flow: [],
    applications: ["Dairy Barns", "Commercial Dairy Farms", "Livestock Housing", "Modern Dairy Facilities"],
    specs: [
      { label: "Category", values: ["Housing Solution"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Material", values: ["Galvanized Steel"] },
      { label: "System", values: ["Free Stall"] },
      { label: "Installation", values: ["Barn Infrastructure"] },
    ],
    metaTitle: "Free Stall Systems — Agriprom Pakistan | Ruminant Comfort Solutions",
    metaDescription:
      "Free Stall Systems are engineered to maximize cow comfort, improve barn organization, enhance hygiene, and support higher productivity in modern dairy operations.",
  },
  "ruminants/energy-boosters/energy-booster": {
    slug: "energy-booster",
    catalog: "ruminants",
    media: "placeholder",
    eyebrow: "Ruminants · Energy Boosters",
    name: "Energy Booster",
    subtitle: "FRESH COW ENERGY",
    intro:
      "Oral energy drench of propylene glycol and glycerin, fortified with vitamins A, D3, E, and niacin. Developed for fresh cows around calving, it boosts energy levels, stimulates appetite and activity, and helps prevent nutritional problems such as ketosis.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Fast energy support from glucose precursors right after calving",
      "Stimulates appetite and feed intake during the transition period",
      "Supports cows showing symptoms of ketosis and limits the effects of fatty liver",
      "Supports milk production, immunity, and fertility in early lactation",
    ],
    flow: [],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows", "Fresh Cows Around Calving"],
    specs: [
      { label: "Category", values: ["Energy Booster"] },
      { label: "Species", values: ["Dairy Cattle"] },
      { label: "Form", values: ["Liquid"] },
      { label: "Packaging", values: ["5 Litre / Can (5 KG)"] },
    ],
    metaTitle: "Energy Booster — Agriprom Pakistan | Ruminant Energy Boosters",
    metaDescription:
      "Oral energy drench of propylene glycol and glycerin, fortified with vitamins A, D3, E, and niacin. Developed for fresh cows around calving, it boosts energy levels, stimulates appetite and activity, and helps prevent nutritional problems such as ketosis.",
  },
  "ruminants/energy-boosters/lactomin-boost": {
    slug: "lactomin-boost",
    catalog: "ruminants",
    media: "placeholder",
    eyebrow: "Ruminants · Energy Boosters",
    name: "Lactomin Boost",
    subtitle: "ONE PREMIX - FOR LACTATION, FATTENING & GROWTH",
    intro:
      "Comprehensive vitamin and mineral premix formulated for dairy cows, lactation, fattening, and growth to meet daily nutritional requirements, regulate microflora, and enhance performance.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Meets vitamin and mineral requirements of dairy cows",
      "Regulates rumen and intestinal microflora",
      "Increases milk yield and improves milk quality when used regularly",
      "Supports proper udder health and high-quality colostrum",
      "Reduces metabolic disorders such as milk fever, ketosis, and retained placenta",
      "Increases fertility by regulating heat and maintaining body condition during the dry period",
      "Improves muscle deposition, carcass quality, and strengthens immunity during fattening",
    ],
    flow: [],
    applications: ["Dairy Farms", "Commercial Farms", "Lactating & Dry Cows", "Heifers", "Fattening Animals"],
    specs: [
      { label: "Category", values: ["Energy Booster"] },
      { label: "Species", values: ["Dairy Cows, Dry Cows, Heifers, Fattening Animals"] },
      { label: "Form", values: ["Powder Premix"] },
      { label: "Packaging", values: ["25 Kg Per Bag"] },
    ],
    metaTitle: "Lactomin Boost — Agriprom Pakistan | Ruminant Energy Boosters",
    metaDescription:
      "Comprehensive vitamin and mineral premix formulated for dairy cows, lactation, fattening, and growth to meet daily nutritional requirements, regulate microflora, and enhance performance.",
  },
  "ruminants/yeast-culture/yeastics-r": {
    slug: "yeastics-r",
    catalog: "ruminants",
    media: "placeholder",
    eyebrow: "Ruminants · Yeast Culture",
    name: "Yeastics-R",
    subtitle: "HIGH POLYSACCHARIDE TRADITIONAL CHINESE MEDICINE YEAST CULTURE",
    intro:
      "High polysaccharide traditional Chinese medicine yeast culture using Astragalus extract as a fermentation substrate, designed to regulate rumen health and improve production efficiency.",
    overviewLead: "",
    overviewPoints: [],
    benefits: [
      "Regulates rumen health and improves rumen fermentation parameters",
      "Enhances immunity and boosts disease and stress resistance through Astragalus polysaccharides",
      "Improves milk quality (milk fat, protein, and lower somatic cell counts)",
      "Boosts growth performance in beef cattle and livestock productivity",
    ],
    flow: [],
    applications: ["Dairy Farms", "Commercial Farms", "Dairy Cows", "Beef Cattle", "Calves", "Sheep & Goats"],
    specs: [
      { label: "Category", values: ["Yeast Culture"] },
      { label: "Species", values: ["Dairy Cows, Beef Cattle, Calves, Sheep, Goat"] },
      { label: "Form", values: ["Uniform color, no caking"] },
      { label: "Packaging", values: ["25 KG Bag"] },
    ],
    metaTitle: "Yeastics-R — Agriprom Pakistan | Ruminant Yeast Culture",
    metaDescription:
      "High polysaccharide traditional Chinese medicine yeast culture using Astragalus extract as a fermentation substrate, designed to regulate rumen health and improve production efficiency.",
  },
};
