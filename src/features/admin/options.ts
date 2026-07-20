import { AppUser, getUserRoleId, getUserRoleTitle } from '../../api/useUsers';
import { DropdownOption } from '../orders/types';

/**
 * Backend par roles/brands ka apna koi integrated endpoint nahi hai, is liye
 * options mojooda users ke populated data se bante hain (wahi tareeqa jo
 * expenses/sales orders mein hai). List khali ho to niche wali placeholder
 * list use hoti hai warna pehla user banaya hi nahi ja sakta.
 */
const FALLBACK_ROLE_TITLES = ['Admin', 'Manager', 'Editor', 'Viewer'];
const FALLBACK_BRANDS = ['Gifts360', 'Nike', 'Adidas', 'Zara', 'Puma'];

export const getRoleOptions = (users: AppUser[]): DropdownOption[] => {
  const byId = new Map<string, DropdownOption>();

  users.forEach(user => {
    const value = getUserRoleId(user.role);
    const label = getUserRoleTitle(user.role);
    if (value && label && !byId.has(value)) byId.set(value, { label, value });
  });

  if (byId.size === 0) {
    // Placeholder: label aur value dono title hi hain — backend agar _id
    // maangta hai to ye reject hoga, tab tak pehla user seed karna hoga.
    return FALLBACK_ROLE_TITLES.map(title => ({ label: title, value: title }));
  }

  return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label));
};

export const getBrandOptions = (users: AppUser[]): string[] => {
  const brands = new Set<string>();
  users.forEach(user => user.brands?.forEach(brand => brands.add(brand)));

  if (brands.size === 0) return FALLBACK_BRANDS;

  return [...brands].sort((a, b) => a.localeCompare(b));
};
