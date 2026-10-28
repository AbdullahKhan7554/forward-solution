/**
 * Single GSAP entry point.
 *
 * Core only — ScrollTrigger lives in "@/lib/scroll-trigger", which components
 * that scroll-link (ScrollTrigger or a `scrollTrigger:` tween option) import
 * instead, so the plugin is registered only where it is used.
 */
import { gsap } from "gsap";

if (typeof window !== "undefined") {
  // Global defaults so no scene has to restate the brand rhythm.
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export { gsap };
