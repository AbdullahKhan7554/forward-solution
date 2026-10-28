/**
 * GSAP + ScrollTrigger. Import from here (instead of "@/lib/gsap") in any
 * module that uses ScrollTrigger or a `scrollTrigger:` tween option; the plugin
 * is registered once, client-side, the first time such a module loads.
 */
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "./gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
