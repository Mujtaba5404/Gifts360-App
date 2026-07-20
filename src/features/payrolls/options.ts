import {
  Payroll,
  PayrollEmployee,
  PayrollPicklistValue,
} from '../../api/usePayrolls';
import { DropdownOption } from '../orders/types';

/** Status backend par enum hai, is liye yahin fix kar diya. */
export const PAYROLL_STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Paid', value: 'paid' },
];

const dedupeById = <T extends { _id: string }>(list: T[]): T[] => {
  const byId = new Map<string, T>();
  list.forEach(entry => {
    if (entry?._id && !byId.has(entry._id)) byId.set(entry._id, entry);
  });
  return [...byId.values()];
};

/**
 * Employee aur paymentMode ka koi apna endpoint nahi hai (wahi masla jaisa
 * expenses/sales orders mein hai), is liye options mojooda payrolls ke
 * populated objects se bante hain — un par asli _id hota hai.
 */
export const getEmployeeOptions = (payrolls: Payroll[]): DropdownOption[] =>
  dedupeById(
    payrolls.map(row => row.employee).filter(Boolean) as PayrollEmployee[],
  )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(employee => ({ label: employee.name, value: employee._id }));

export const getPaymentModeOptions = (payrolls: Payroll[]): DropdownOption[] =>
  dedupeById(
    payrolls
      .map(row => row.paymentMode)
      .filter(Boolean) as PayrollPicklistValue[],
  )
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(entry => ({ label: entry.title, value: entry._id }));

/** Net pay hamesha derived hai — user isse type nahi karta. */
export const calculateNetPay = (parts: {
  basicSalary: number;
  allowances: number;
  bonus: number;
  overtime: number;
  deductions: number;
}) =>
  parts.basicSalary +
  parts.allowances +
  parts.bonus +
  parts.overtime -
  parts.deductions;

/** "2026-07-01T..." -> "Jul 2026" */
export const formatMonth = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};
