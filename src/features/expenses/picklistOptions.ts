import { Expense, Picklist } from '../../api/useExpenses';

export interface PicklistOption {
  label: string;
  value: string;
}

const dedupeById = (picklists: Picklist[]): Picklist[] => {
  const byId = new Map<string, Picklist>();

  picklists.forEach(item => {
    if (item?._id && !byId.has(item._id)) {
      byId.set(item._id, item);
    }
  });

  return [...byId.values()].sort((a, b) => a.title.localeCompare(b.title));
};

const toOptions = (picklists: Picklist[]): PicklistOption[] =>
  picklists.map(item => ({ label: item.title, value: item._id }));

/**
 * Backend par picklists ka apna koi endpoint nahi hai, is liye Expense/Category
 * ke options mojooda expenses ke `type` aur `category` objects se hi bante hain
 * (in par asli _id maujood hota hai, jo create ke waqt bhejna zaroori hai).
 */
export const getTypeOptions = (expenses: Expense[]): PicklistOption[] =>
  toOptions(dedupeById(expenses.map(item => item.type).filter(Boolean)));

/** Category apne parent type ke under aati hai (`parentPicklist` === type._id). */
export const getCategoryOptions = (
  expenses: Expense[],
  typeId?: string,
): PicklistOption[] => {
  const categories = expenses
    .map(item => item.category)
    .filter(Boolean)
    .filter(category => !typeId || category.parentPicklist === typeId);

  return toOptions(dedupeById(categories));
};
