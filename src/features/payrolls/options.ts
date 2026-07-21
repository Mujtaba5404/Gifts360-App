// options.ts
import { Payroll, PayrollEmployee } from '../../api/usePayrolls';
import { DropdownOption } from '../orders/types';

const dedupeById = <T extends { _id: string }>(list: T[]): T[] => {
  const byId = new Map<string, T>();
  list.forEach(entry => {
    if (entry?._id && !byId.has(entry._id)) byId.set(entry._id, entry);
  });
  return [...byId.values()];
};

const getEmployeeName = (employee: PayrollEmployee) =>
  [employee.personal?.firstName, employee.personal?.lastName]
    .filter(Boolean)
    .join(' ') || 'Unknown employee';

    
export const getEmployeeOptions = (payrolls: Payroll[]): DropdownOption[] =>
  dedupeById(
    payrolls.map(row => row.employee).filter(Boolean) as PayrollEmployee[],
  )
    .sort((a, b) => getEmployeeName(a).localeCompare(getEmployeeName(b)))
    .map(employee => ({ label: getEmployeeName(employee), value: employee._id }));

/** Net salary hamesha derived hai — user isse type nahi karta. */
export const calculateNetSalary = (parts: {
  salary: number;
  arrears: number;
  deduction: number;
  tax: number;
}) => parts.salary + parts.arrears - parts.deduction - parts.tax;

/** "2026-07-01T..." -> "Jul 2026" */
export const formatMonth = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};