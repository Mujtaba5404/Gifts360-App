import { Item, ItemPicklistValue } from '../../api/useItems';
import { DropdownOption } from '../orders/types';

const dedupeById = (list: ItemPicklistValue[]): ItemPicklistValue[] => {
  const byId = new Map<string, ItemPicklistValue>();
  list.forEach(entry => {
    if (entry?._id && !byId.has(entry._id)) byId.set(entry._id, entry);
  });
  return [...byId.values()].sort((a, b) => a.title.localeCompare(b.title));
};

export const getItemPicklistOptions = (
  items: Item[],
  field: 'category' | 'unit',
): DropdownOption[] =>
  dedupeById(items.map(item => item[field]).filter(Boolean) as ItemPicklistValue[])
    .map(entry => ({ label: entry.title, value: entry._id }));
