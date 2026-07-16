/**
 * The logged-in user object stored in redux (`role.user`) ka shape backend ke
 * hisaab se thoda alag ho sakta hai (kabhi `username`, kabhi `name`,
 * kabhi `fullName`). In helpers se har jagah name/email ek jaisa dikhता hai.
 */
interface StoredUser {
  username?: string;
  name?: string;
  fullName?: string;
  email?: string;
}

export const getDisplayEmail = (
  user?: StoredUser | null,
  fallbackEmail?: string,
): string => {
  return user?.email || fallbackEmail || '';
};

const capitalizeFirst = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getDisplayName = (
  user?: StoredUser | null,
  fallbackEmail?: string,
): string => {
  const name = user?.username || user?.name || user?.fullName;
  if (name && name.trim()) return capitalizeFirst(name.trim());

  // Naam na ho to email ke pehle hisse ko name ki tarah dikha do.
  const email = getDisplayEmail(user, fallbackEmail);
  if (email.includes('@')) return capitalizeFirst(email.split('@')[0]);

  return 'User';
};
