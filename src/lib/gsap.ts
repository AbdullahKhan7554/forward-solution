/**
 * Single GSAP registration point.
 *
 * Plugins are registered exactly once, client-side. Every module imports
 * `gsap` and `ScrollTrigger` from here — never from "gsap" directly — so we
 * can never double-register or run plugin code on the server.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Global defaults so no scene has to restate the brand rhythm.
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export { gsap, ScrollTrigger };
