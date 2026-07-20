/**
 * List screens par avatar/label dikhane ke chhote helpers.
 * Pehle ye alag-alag files mein copy hue the — ab ek hi jagah.
 */
import capitalizeLetters from './capitalizeLetters';

const AVATAR_COLORS = [
  '#4263EB',
  '#1b342e',
  '#E8590C',
  '#0C8599',
  '#6741D9',
  '#C2255C',
  '#2B8A3E',
  '#9C36B5',
];

/**
 * Kuch fields (designation, source, company, type) API se kabhi plain string
 * aati hain aur kabhi populated picklist object `{_id, title, value, ...}`.
 * Object ko seedha <Text> mein render karne se React crash karta hai, is liye
 * har haal mein ek safe string wapas karte hain.
 */
export const pickText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const label = obj.title ?? obj.name ?? obj.value;
    return typeof label === 'string' ? label : '';
  }
  return String(value);
};

/**
 * Address object ko ek line mein badalta hai. Customer aur Vendor dono ka
 * shape ek jaisa hai, is liye structural type liya hai (api layer par
 * depend karne ki zaroorat nahi).
 */
export const formatAddress = (
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
  },
  /**
   * Har part ko alag se capitalize karta hai. Poori joined string par
   * capitalizeLetters lagana ghalat hai — lodash.startCase commas kha jata hai.
   */
  options?: { capitalize?: boolean },
): string => {
  if (!address) return '';
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.country,
  ].filter(Boolean) as string[];

  return (
    options?.capitalize ? parts.map(part => capitalizeLetters(part)) : parts
  ).join(', ');
};

/** "Ali Traders" -> "AT", "Ali" -> "A" */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/** Ek hi id ka rang hamesha same rehta hai (list scroll par flicker na ho). */
export const getAvatarColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
