import {
  SalesOrder,
  SalesOrderPicklistValue,
  SalesOrderPerson,
} from '../../api/useSalesOrders';
import { DropdownOption } from '../orders/types';


export const ORDER_STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Returned', value: 'returned' },
];

export const SALES_PAYMENT_STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
];

const dedupeById = <T extends { _id: string }>(list: T[]): T[] => {
  const byId = new Map<string, T>();
  list.forEach(entry => {
    if (entry?._id && !byId.has(entry._id)) byId.set(entry._id, entry);
  });
  return [...byId.values()];
};


export const getPicklistOptions = (
  orders: SalesOrder[],
  field: 'paymentMode' | 'occasion',
): DropdownOption[] =>
  dedupeById(
    orders
      .map(order => order[field])
      .filter(Boolean) as SalesOrderPicklistValue[],
  )
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(entry => ({ label: entry.title, value: entry._id }));

export const getSalesPersonOptions = (
  orders: SalesOrder[],
): DropdownOption[] =>
  dedupeById(
    orders.map(order => order.salesPerson).filter(Boolean) as SalesOrderPerson[],
  )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(person => ({ label: person.name, value: person._id }));
