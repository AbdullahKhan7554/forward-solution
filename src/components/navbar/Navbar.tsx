"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";
import { GlobalSearch } from "@/components/search/GlobalSearch";

type DropdownItem = {
  title: string;
  desc: string;
  href: string;
  Icon: ComponentType;
};

const PRODUCT_ITEMS: DropdownItem[] = [
  {
    title: "Product Overview",
    desc: "Explore the full range of animal health solutions",
    href: "/products",
    Icon: GridIcon,
  },
  {
    title: "Poultry",
    desc: "Advanced poultry nutrition & health solutions",
    href: "/products/poultry",
    Icon: BirdIcon,
  },
  {
    title: "Ruminants",
    desc: "Modern feed additives and veterinary solutions",
    href: "/products/ruminants",
    Icon: CowIcon,
  },
  {
    title: "Companion Animals",
    desc: "Premium companion animal healthcare",
    href: "/products/companion-animals",
    Icon: DogIcon,
  },
];

const RESOURCE_ITEMS: DropdownItem[] = [
  {
    title: "FAQ",
    desc: "Answers to the questions we hear most",
    href: "/faq",
    Icon: HelpIcon,
  },
  {
    title: "Privacy Policy",
    desc: "How we handle and protect your data",
    href: "/privacy-policy",
    Icon: ShieldIcon,
  },
  {
    title: "Terms & Conditions",
    desc: "The terms governing use of our site",
    href: "/terms-of-use",
    Icon: DocIcon,
  },
];

type NavLink = {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
  /** Route prefixes that mark this link (and its dropdown) as active. */
  activePrefixes?: string[];
};

const LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Products",
    href: "/products",
    dropdown: PRODUCT_ITEMS,
    activePrefixes: ["/products", "/ruminants", "/companion-animals"],
  },
  { label: "Blogs", href: "/blog" },
  {
    label: "Resources",
    href: "/faq",
    dropdown: RESOURCE_ITEMS,
    activePrefixes: ["/faq", "/privacy-policy", "/terms-of-use"],
  },
];

/* ── thin-line category icons (Lucide-style, self-contained) ─────────────── */
function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function GridIcon() {
  return (
    <IconBase>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}
function BirdIcon() {
  return (
    <IconBase>
      <path d="M16 7h.01" />
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
      <path d="m20 7 2 .5-2 .5" />
      <path d="M10 18v3M14 17.75V21" />
      <path d="M7 18a6 6 0 0 0 3.84-10.61" />
    </IconBase>
  );
}
function CowIcon() {
  return (
    <IconBase>
      <circle cx="12.5" cy="12" r="2.25" />
      <path d="M8 4a6.5 6.5 0 0 0-4.7 11 4 4 0 0 0 3.2 5.5c1.7.2 3.5.3 5.5.3s3.8-.1 5.5-.3a4 4 0 0 0 3.2-5.5A6.5 6.5 0 0 0 16 4" />
      <path d="M8 4c1.2 1 2.6 1.5 4 1.5S14.8 5 16 4" />
      <path d="M9.5 15.5c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9" />
    </IconBase>
  );
}
function DogIcon() {
  return (
    <IconBase>
      <path d="M11.25 16.25h1.5L12 17z" />
      <path d="M16 14v.5M8 14v.5" />
      <path d="M4.42 11.25A13 13 0 0 0 4 14.56C4 18.73 7.58 21 12 21s8-2.27 8-6.44a11.7 11.7 0 0 0-.49-3.31" />
      <path d="M8.5 8.5c-.38 1.05-1.08 2.03-2.34 2.5-1.93.72-3.58-.3-3.66-1-.11-.99 1.18-6.53 4-7C8.42 2.68 10.15 3.85 10.15 5.24A7.5 7.5 0 0 1 14 5.28c0-1.39 1.84-2.6 3.77-2.28 2.82.47 4.11 6.01 4 7-.08.7-1.73 1.72-3.66 1-1.26-.47-1.96-1.45-2.34-2.5" />
    </IconBase>
  );
}
function HelpIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.7 2.7-2.7 2.7" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}
function ShieldIcon() {
  return (
    <IconBase>
      <path d="M12 3 5 6v5.5c0 4.3 2.9 7.4 7 8.5 4.1-1.1 7-4.2 7-8.5V6z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </IconBase>
  );
}
function DocIcon() {
  return (
    <IconBase>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </IconBase>
  );
}
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * A premium text-roll: the label rolls up to reveal a brand-blue duplicate.
 */
function RollLink({ label, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <a
      data-nav-inner
      href={href}
      aria-current={active ? "page" : undefined}
      className="group relative block will-change-transform"
    >
      <span className="relative block h-[1.35em] overflow-hidden">
        <span className="block transition-transform duration-[560ms] ease-brand-luxury group-hover:-translate-y-1/2">
          <span className="flex h-[1.35em] items-center font-sans text-small font-medium text-neutral-900 transition-colors duration-[360ms] ease-brand-out group-data-[scrolled=true]/nav:text-neutral-200">
            {label}
          </span>
          <span className="flex h-[1.35em] items-center font-sans text-small font-medium text-accent-600 group-data-[scrolled=true]/nav:text-accent-300">
            {label}
          </span>
        </span>
      </span>
      {/* animated active-page underline */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 h-px w-full origin-left bg-accent-500 transition-transform duration-300 ease-brand-out",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </a>
  );
}

/**
 * NavDropdown — desktop hover/focus disclosure with the shared glass card.
 * Opens on hover or keyboard; graceful close on mouse-leave/Escape/outside-click;
 * arrow-key navigation, focus trap and ARIA menu roles. GSAP handles the fade+rise
 * and the 50ms item stagger. Reduced motion collapses to an instant show/hide.
 * Reused for both Products and Resources so there is one dropdown implementation.
 */
function NavDropdown({
  label,
  items,
  reducedRef,
  active,
  pathname,
}: {
  label: string;
  items: DropdownItem[];
  reducedRef: React.MutableRefObject<boolean>;
  active?: boolean;
  pathname: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  // Build the open/close timeline once (paused).
  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(menuRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" });
      tl.fromTo(
        menuRef.current!.querySelectorAll("[data-menu-item]"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out", stagger: 0.05 },
        "-=0.12"
      );
      tlRef.current = tl;
    }, rootRef);
    return () => ctx.revert();
  }, [reducedRef]);

  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current) {
      gsap.set(menuRef.current, { autoAlpha: open ? 1 : 0 });
      return;
    }
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open, reducedRef]);

  // Close when a pointer press or focus lands outside the dropdown.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  const focusItem = (i: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!items.length) return;
    const idx = (i + items.length) % items.length;
    items[idx]?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      // focus trap while open
      e.preventDefault();
      focusItem(e.shiftKey ? current - 1 : current + 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="block overflow-hidden py-1">
        <button
          ref={triggerRef}
          data-nav-inner
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onKeyDown={onTriggerKeyDown}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "group flex items-center gap-1.5 font-sans text-small font-medium transition-colors duration-[360ms] ease-brand-out",
            open
              ? "text-accent-600 group-data-[scrolled=true]/nav:text-accent-300"
              : "text-neutral-900 hover:text-accent-600 group-data-[scrolled=true]/nav:text-neutral-200"
          )}
        >
          {label}
          <span className={cn("transition-transform duration-300 ease-brand-out", open && "rotate-180")}>
            <Chevron />
          </span>
        </button>
      </span>
      {/* animated active-page underline */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-1 left-0 h-px w-[calc(100%-18px)] origin-left bg-accent-500 transition-transform duration-300 ease-brand-out",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />

      {/* glass dropdown card */}
      <div
        ref={menuRef}
        role="menu"
        aria-label={label}
        onKeyDown={onMenuKeyDown}
        className={cn(
          "invisible absolute left-0 top-full z-modal w-[300px] pt-3 opacity-0",
          !open && "pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/75 p-6 shadow-medium backdrop-blur-xl backdrop-saturate-150">
          {items.map((item, i) => {
            const itemActive = pathname === item.href;
            return (
              <a
                key={item.href}
                data-menu-item
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                href={item.href}
                aria-current={itemActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "group/item relative flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-[transform,background-color,color] duration-150 ease-brand-out hover:translate-x-1 hover:bg-primary-50 focus-visible:translate-x-1 focus-visible:bg-primary-50 focus-visible:ring-2 focus-visible:ring-accent-500",
                  itemActive && "bg-primary-50"
                )}
              >
                {/* left indicator line */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 w-[2px] -translate-y-1/2 rounded-full bg-primary-600 transition-all duration-150 ease-brand-out group-hover/item:h-[62%] group-focus-visible/item:h-[62%]",
                    itemActive ? "h-[62%]" : "h-0"
                  )}
                />
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-600/12 bg-primary-50/70 text-primary-700 transition-colors duration-150 ease-brand-out group-hover/item:border-accent-300/50 group-hover/item:text-accent-600">
                  <item.Icon />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-sans text-body font-medium transition-colors duration-150 ease-brand-out group-hover/item:text-primary-700",
                      itemActive ? "text-primary-700" : "text-neutral-900"
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="mt-0.5 block font-sans text-caption leading-snug text-neutral-500">
                    {item.desc}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileAccordion — an expandable disclosure inside the hamburger menu, reused
 * for Products and Resources. GSAP animates height:auto + opacity so there is no
 * layout jump; reduced motion snaps open/closed. Touch targets are >= 48px and
 * the active page is highlighted.
 */
function MobileAccordion({
  link,
  open,
  onToggle,
  onNavigate,
  reducedRef,
  pathname,
}: {
  link: NavLink;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  reducedRef: React.MutableRefObject<boolean>;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `mobile-accordion-${link.label.toLowerCase()}`;

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (reducedRef.current) {
      gsap.set(panel, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
      return;
    }
    gsap.to(panel, {
      height: open ? "auto" : 0,
      autoAlpha: open ? 1 : 0,
      duration: 0.4,
      ease: "power3.inOut",
    });
  }, [open, reducedRef]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex min-h-[48px] w-full items-center justify-between font-display text-h2 font-light text-neutral-50 transition-colors duration-200 ease-brand-out hover:text-accent-300 focus-visible:text-accent-300 focus-visible:outline-none"
      >
        {link.label}
        <span className={cn("transition-transform duration-300 ease-brand-out", open && "rotate-180")}>
          <Chevron />
        </span>
      </button>
      <div id={panelId} ref={panelRef} className="h-0 overflow-hidden opacity-0">
        <div className="flex flex-col gap-1 py-2 pl-4">
          {link.dropdown!.map((item) => {
            const itemActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={itemActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[48px] items-center gap-3 font-sans text-body-lg transition-colors duration-200 ease-brand-out hover:text-accent-300 focus-visible:text-accent-300 focus-visible:outline-none",
                  itemActive ? "text-accent-300" : "text-neutral-300"
                )}
              >
                <span className={cn(itemActive ? "text-accent-300" : "text-neutral-400")}>
                  <item.Icon />
                </span>
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Navbar - floating, integrated into the hero's light.
 */
export function Navbar() {
  const { phase } = useIntro();
  const pathname = usePathname() || "/";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  // A dropdown (Products / Resources) is active when the route matches any of
  // its declared prefixes.
  const isDropdownActive = (link: NavLink) =>
    (link.activePrefixes ?? []).some((p) => pathname.startsWith(p));
  const ref = useRef<HTMLElement>(null);
  const reducedRef = useRef(false);
  const revealedRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Which mobile accordion is expanded (by label); null = all collapsed.
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !ref.current) return;
    gsap.set(ref.current.querySelectorAll("[data-nav-inner]"), { yPercent: 120 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (phase !== "revealing" || reducedRef.current || revealedRef.current) return;
    if (!ref.current) return;
    revealedRef.current = true;
    gsap.to(ref.current.querySelectorAll("[data-nav-inner]"), {
      yPercent: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.06,
      delay: 0.45,
    });
  }, [phase]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => {
    setMenuOpen(false);
    setOpenAccordion(null);
  };

  return (
    <>
      <header
        ref={ref}
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "group/nav fixed inset-x-0 top-0 z-sticky transition-all duration-[360ms] ease-brand-out",
          scrolled
            ? "border-b border-white/10 bg-dark-rich/90 py-3 shadow-[0_14px_44px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent py-5 shadow-none"
        )}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-6 md:px-12 xl:px-20">
          <a href="/" aria-label="Agriprom Pakistan — home" className="block overflow-hidden">
            <span data-nav-inner className="inline-block will-change-transform">
              <Wordmark className="text-neutral-900" />
            </span>
          </a>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            {LINKS.map((link) =>
              link.dropdown ? (
                <NavDropdown
                  key={link.label}
                  label={link.label}
                  items={link.dropdown}
                  reducedRef={reducedRef}
                  active={isDropdownActive(link)}
                  pathname={pathname}
                />
              ) : (
                <span key={link.label} className="block overflow-hidden py-1">
                  <RollLink label={link.label} href={link.href} active={isActive(link.href)} />
                </span>
              )
            )}
          </nav>

          <div className="flex items-center gap-3 lg:gap-5">
            <GlobalSearch />

            <div className="hidden lg:block">
            <span className="block overflow-hidden">
              <a
                data-nav-inner
                href="/contact-us/"
                className="group block will-change-transform rounded-sm border border-transparent bg-neutral-900 px-8 py-3.5 shadow-soft transition-colors duration-[360ms] ease-brand-out hover:bg-neutral-800 group-data-[scrolled=true]/nav:border-white/25 group-data-[scrolled=true]/nav:bg-transparent group-data-[scrolled=true]/nav:shadow-none group-data-[scrolled=true]/nav:hover:border-accent-300/60"
              >
                <span className="block h-[1.2em] overflow-hidden">
                  <span className="block transition-transform duration-[560ms] ease-brand-luxury group-hover:-translate-y-1/2">
                    <span className="flex h-[1.2em] items-center font-sans text-small font-medium text-neutral-50">
                      Contact
                    </span>
                    <span className="flex h-[1.2em] items-center font-sans text-small font-medium text-accent-300">
                      Contact
                    </span>
                  </span>
                </span>
              </a>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300/70 bg-white/40 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-[360ms] ease-brand-out hover:border-accent-500/50 hover:bg-white/75 hover:shadow-soft group-data-[scrolled=true]/nav:border-white/20 group-data-[scrolled=true]/nav:bg-white/10 lg:hidden"
          >
            {/* editorial variable-width bars that redistribute on press/hover */}
            <span className="relative block h-[11px] w-[22px]">
              <span className="absolute left-0 top-0 h-[1.5px] w-full origin-left rounded-full bg-neutral-900 transition-all duration-[360ms] ease-brand-luxury group-hover:w-[64%] group-data-[scrolled=true]/nav:bg-neutral-50" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-[68%] -translate-y-1/2 rounded-full bg-neutral-900 transition-all duration-[360ms] ease-brand-luxury group-hover:w-full group-data-[scrolled=true]/nav:bg-neutral-50" />
              <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left rounded-full bg-neutral-900 transition-all duration-[360ms] ease-brand-luxury group-hover:w-[42%] group-data-[scrolled=true]/nav:bg-neutral-50" />
            </span>
          </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-overlay flex flex-col bg-dark-rich transition-all duration-500 ease-brand-out lg:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Wordmark className="text-neutral-50" />
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close menu"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-[background-color,border-color] duration-300 ease-brand-out hover:border-accent-300/50 hover:bg-white/10"
          >
            <span className="relative block h-5 w-5 transition-transform duration-500 ease-brand-luxury group-hover:rotate-90">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 rounded-full bg-neutral-50" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-neutral-50" />
            </span>
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
          {LINKS.map((link) =>
            link.dropdown ? (
              <MobileAccordion
                key={link.label}
                link={link}
                open={openAccordion === link.label}
                onToggle={() =>
                  setOpenAccordion((cur) => (cur === link.label ? null : link.label))
                }
                onNavigate={closeMobile}
                reducedRef={reducedRef}
                pathname={pathname}
              />
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-[48px] items-center font-display text-h2 font-light transition-colors duration-200 ease-brand-out hover:text-accent-300 focus-visible:text-accent-300 focus-visible:outline-none",
                  isActive(link.href) ? "text-accent-300" : "text-neutral-50"
                )}
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="/contact-us/"
            onClick={closeMobile}
            className="mt-8 inline-flex w-fit items-center rounded-sm bg-primary-600 px-7 py-3 font-sans text-body font-medium text-pure"
          >
            Contact
          </a>
        </nav>
      </div>
    </>
  );
}
