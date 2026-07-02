import { NotFound404 } from "@/components/error/NotFound404";

/**
 * Global 404 (Next `not-found` convention). Rendered within the root layout, so
 * it inherits the fonts + smooth-scroll authority. A self-contained, full-
 * viewport premium screen — its two CTAs provide all the navigation it needs.
 */
export default function NotFound() {
  return <NotFound404 />;
}
