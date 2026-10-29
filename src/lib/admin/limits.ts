/** Admin text length limits — the forms' maxLength and the server actions' checks share these. */
export const LIMITS = {
  productName: 120,
  subtitle: 160,
  metaDescription: 160,
  blogTitle: 150,
} as const;

/**
 * Error message when `value` is over `max`, else null. A stored value that was already
 * longer and is left unchanged still saves, so older rows stay editable.
 */
export function tooLong(field: string, value: string, max: number, stored?: string | null) {
  const v = value.trim();
  if (v.length <= max || (stored != null && stored.trim() === v)) return null;
  return `${field} must be ${max} characters or fewer (it's ${v.length}).`;
}

export const CONFLICT = "Someone else changed this item. Reload to see the latest version.";
